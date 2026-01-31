import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";

import { prisma } from "@/lib/prisma";
import { stripe, SUBSCRIPTION_PLANS } from "@/lib/stripe";
import {
  sendEmail,
  subscriptionConfirmedEmail,
  subscriptionCancelledEmail,
  paymentFailedEmail,
  paymentRetryEmail,
} from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET not set");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaid(invoice);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoiceFailed(invoice);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const customerId = session.customer as string;

  if (!userId) {
    console.error("No userId in checkout session metadata");
    return;
  }

  // For one-time payments (lifetime)
  if (session.mode === "payment") {
    await prisma.user.update({
      where: { id: userId },
      data: {
        stripeCustomerId: customerId,
        subscriptionStatus: "ACTIVE",
        subscriptionEndsAt: null, // Lifetime = no end date
      },
    });
    return;
  }

  // For subscriptions, the subscription.created event will handle the update
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: customerId },
  });

  if (!user) {
    console.error("No user found for customer:", customerId);
    return;
  }

  const previousStatus = user.subscriptionStatus;
  const status = mapStripeStatus(subscription.status);
  // Type assertion for current_period_end which exists on subscription
  const subData = subscription as unknown as { current_period_end: number };
  const currentPeriodEnd = new Date(subData.current_period_end * 1000);
  const priceId = subscription.items.data[0]?.price.id;

  await prisma.user.update({
    where: { id: user.id },
    data: {
      subscriptionId: subscription.id,
      subscriptionStatus: status,
      subscriptionPriceId: priceId,
      subscriptionEndsAt: currentPeriodEnd,
    },
  });

  // Send confirmation email when subscription becomes active (new subscription)
  if (status === "ACTIVE" && previousStatus !== "ACTIVE" && user.email) {
    const planName = priceId === SUBSCRIPTION_PLANS.annual.priceId ? "Annual" : "Monthly";
    const amount = priceId === SUBSCRIPTION_PLANS.annual.priceId ? "€199/year" : "€19.99/month";
    const email = subscriptionConfirmedEmail({
      firstName: user.firstName,
      plan: planName,
      amount,
      nextBillingDate: currentPeriodEnd.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    });
    await sendEmail({ to: user.email, ...email });
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: customerId },
  });

  if (!user) return;

  // Get the end date before we clear subscription data
  const subData = subscription as unknown as { current_period_end: number };
  const endDate = new Date(subData.current_period_end * 1000);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      subscriptionStatus: "CANCELED",
      subscriptionId: null,
    },
  });

  // Send cancellation email
  if (user.email) {
    const email = subscriptionCancelledEmail({
      firstName: user.firstName,
      endDate: endDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    });
    await sendEmail({ to: user.email, ...email });
  }
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;

  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: customerId },
  });

  if (!user) return;

  // Ensure subscription is active after successful payment
  if (user.subscriptionStatus !== "ACTIVE") {
    await prisma.user.update({
      where: { id: user.id },
      data: { subscriptionStatus: "ACTIVE" },
    });
  }
}

async function handleInvoiceFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;

  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: customerId },
  });

  if (!user) return;

  await prisma.user.update({
    where: { id: user.id },
    data: { subscriptionStatus: "PAST_DUE" },
  });

  // Send payment failed email with dunning info
  if (user.email) {
    const attemptCount = invoice.attempt_count || 1;
    const amount = invoice.amount_due
      ? `€${(invoice.amount_due / 100).toFixed(2)}`
      : "your subscription";

    // Stripe typically retries 3 times by default
    const finalAttempt = attemptCount >= 3;

    if (attemptCount === 1) {
      // First failure - send initial payment failed email
      const nextAttempt = invoice.next_payment_attempt
        ? new Date(invoice.next_payment_attempt * 1000).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : undefined;

      const email = paymentFailedEmail({
        firstName: user.firstName,
        amount,
        retryDate: nextAttempt,
      });
      await sendEmail({ to: user.email, ...email });
    } else {
      // Subsequent failures - send retry email
      const email = paymentRetryEmail({
        firstName: user.firstName,
        amount,
        attemptNumber: attemptCount,
        finalAttempt,
      });
      await sendEmail({ to: user.email, ...email });
    }
  }
}

function mapStripeStatus(status: Stripe.Subscription.Status): "ACTIVE" | "CANCELED" | "PAST_DUE" | "TRIALING" | "INACTIVE" {
  switch (status) {
    case "active":
      return "ACTIVE";
    case "canceled":
      return "CANCELED";
    case "past_due":
      return "PAST_DUE";
    case "trialing":
      return "TRIALING";
    default:
      return "INACTIVE";
  }
}
