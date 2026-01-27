import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

// Stripe webhook events we care about
const relevantEvents = new Set([
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.payment_succeeded",
  "invoice.payment_failed",
]);

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const error = err as Error;
    console.error(`Webhook signature verification failed: ${error.message}`);
    return NextResponse.json(
      { error: `Webhook Error: ${error.message}` },
      { status: 400 }
    );
  }

  if (!relevantEvents.has(event.type)) {
    return NextResponse.json({ received: true });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        if (!userId) {
          console.error("No userId in checkout session metadata");
          break;
        }

        // Get subscription details
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);

        await prisma.user.update({
          where: { id: userId },
          data: {
            stripeCustomerId: customerId,
            subscriptionId: subscriptionId,
            subscriptionStatus: "ACTIVE",
            subscriptionPriceId: subscription.items.data[0]?.price.id,
            subscriptionEndsAt: new Date(subscription.current_period_end * 1000),
          },
        });

        console.log(`Subscription activated for user ${userId}`);
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Find user by Stripe customer ID
        const user = await prisma.user.findUnique({
          where: { stripeCustomerId: customerId },
        });

        if (!user) {
          console.error(`No user found for customer ${customerId}`);
          break;
        }

        // Map Stripe status to our status
        let status: "ACTIVE" | "CANCELED" | "PAST_DUE" | "TRIALING" | "INACTIVE";
        switch (subscription.status) {
          case "active":
            status = "ACTIVE";
            break;
          case "trialing":
            status = "TRIALING";
            break;
          case "past_due":
            status = "PAST_DUE";
            break;
          case "canceled":
          case "unpaid":
            status = "CANCELED";
            break;
          default:
            status = "INACTIVE";
        }

        await prisma.user.update({
          where: { id: user.id },
          data: {
            subscriptionStatus: status,
            subscriptionPriceId: subscription.items.data[0]?.price.id,
            subscriptionEndsAt: new Date(subscription.current_period_end * 1000),
          },
        });

        console.log(`Subscription updated for user ${user.id}: ${status}`);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const user = await prisma.user.findUnique({
          where: { stripeCustomerId: customerId },
        });

        if (!user) {
          console.error(`No user found for customer ${customerId}`);
          break;
        }

        await prisma.user.update({
          where: { id: user.id },
          data: {
            subscriptionStatus: "INACTIVE",
            subscriptionId: null,
            subscriptionPriceId: null,
            subscriptionEndsAt: null,
          },
        });

        console.log(`Subscription deleted for user ${user.id}`);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        const user = await prisma.user.findUnique({
          where: { stripeCustomerId: customerId },
        });

        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              subscriptionStatus: "PAST_DUE",
            },
          });
          console.log(`Payment failed for user ${user.id}`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
