import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";
import {
  createCheckoutSession,
  getOrCreateStripeCustomer,
  isStripeConfigured,
  SUBSCRIPTION_PLANS,
  PlanType,
  FREE_TRIAL_DAYS,
} from "@/lib/stripe";
import { rateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    // Rate limit: 10 requests per minute per IP
    const ip = await getClientIp();
    const rateLimitResult = await rateLimit(`checkout:${ip}`, RATE_LIMITS.strict);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    if (!isStripeConfigured()) {
      return NextResponse.json(
        { error: "Stripe is not configured. Add STRIPE_SECRET_KEY to enable payments." },
        { status: 503 }
      );
    }

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await currentUser();
    if (!user?.emailAddresses[0]?.emailAddress) {
      return NextResponse.json({ error: "No email found" }, { status: 400 });
    }

    const { plan, withTrial } = await request.json();

    if (!plan || !SUBSCRIPTION_PLANS[plan as PlanType]) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const selectedPlan = SUBSCRIPTION_PLANS[plan as PlanType];

    if (!selectedPlan.priceId) {
      return NextResponse.json(
        { error: `Price ID not configured for ${plan} plan. Check STRIPE_${plan.toUpperCase()}_PRICE_ID env variable.` },
        { status: 503 }
      );
    }

    const email = user.emailAddresses[0].emailAddress;

    // Get or create database user
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get or create Stripe customer
    const customerId = await getOrCreateStripeCustomer({
      email,
      userId: dbUser.id,
      name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
      existingCustomerId: dbUser.stripeCustomerId,
    });

    // Update user with Stripe customer ID if new
    if (!dbUser.stripeCustomerId) {
      await prisma.user.update({
        where: { id: dbUser.id },
        data: { stripeCustomerId: customerId },
      });
    }

    // Check if user is eligible for trial (never had a subscription before)
    const eligibleForTrial =
      withTrial &&
      FREE_TRIAL_DAYS > 0 &&
      !dbUser.subscriptionId &&
      dbUser.subscriptionStatus === "INACTIVE";

    // Create checkout session
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const session = await createCheckoutSession({
      customerId,
      priceId: selectedPlan.priceId,
      userId: dbUser.id,
      email,
      successUrl: `${baseUrl}/subscribe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${baseUrl}/pricing`,
      withTrial: eligibleForTrial,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to create checkout session: ${errorMessage}` },
      { status: 500 }
    );
  }
}
