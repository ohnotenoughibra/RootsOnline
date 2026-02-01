import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { nanoid } from "nanoid";

import { prisma } from "@/lib/prisma";
import { stripe, isStripeConfigured, SUBSCRIPTION_PLANS } from "@/lib/stripe";

// GET - get user's purchased gifts
export async function GET() {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: {
        giftsPurchased: {
          orderBy: { createdAt: "desc" },
        },
        giftsReceived: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      purchased: user.giftsPurchased,
      received: user.giftsReceived,
    });
  } catch (error) {
    console.error("Error getting gifts:", error);
    return NextResponse.json(
      { error: "Failed to get gifts" },
      { status: 500 }
    );
  }
}

// POST - purchase a gift subscription
export async function POST(request: Request) {
  try {
    if (!isStripeConfigured()) {
      return NextResponse.json(
        { error: "Payments not configured" },
        { status: 503 }
      );
    }

    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clerkUser = await currentUser();
    const { recipientEmail, recipientName, message, plan, duration } =
      await request.json();

    if (!recipientEmail || !plan) {
      return NextResponse.json(
        { error: "Recipient email and plan required" },
        { status: 400 }
      );
    }

    // Validate plan
    if (!["monthly", "annual"].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    // Validate duration
    const durationMonths = parseInt(duration) || (plan === "annual" ? 12 : 1);
    if (durationMonths < 1 || durationMonths > 24) {
      return NextResponse.json(
        { error: "Duration must be 1-24 months" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate price
    const selectedPlan = SUBSCRIPTION_PLANS[plan as keyof typeof SUBSCRIPTION_PLANS];
    const monthlyEquivalent = plan === "annual"
      ? selectedPlan.price / 12
      : selectedPlan.price;
    const totalPrice = Math.round(monthlyEquivalent * durationMonths * 100); // In cents

    // Generate gift code
    const giftCode = `GIFT-${nanoid(10).toUpperCase()}`;

    // Create checkout session for the gift
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const session = await stripe!.checkout.sessions.create({
      customer_email: clerkUser?.emailAddresses[0]?.emailAddress,
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Gift Subscription - ${durationMonths} month${durationMonths > 1 ? "s" : ""}`,
              description: `ROA gift subscription for ${recipientEmail}`,
            },
            unit_amount: totalPrice,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/gift/success?code=${giftCode}`,
      cancel_url: `${baseUrl}/gift`,
      metadata: {
        type: "gift",
        purchaserId: user.id,
        recipientEmail,
        recipientName: recipientName || "",
        message: message || "",
        plan,
        duration: durationMonths.toString(),
        giftCode,
      },
    });

    // Create pending gift subscription
    await prisma.giftSubscription.create({
      data: {
        purchaserId: user.id,
        recipientEmail,
        message,
        plan,
        duration: durationMonths,
        amount: totalPrice,
        giftCode,
        status: "PENDING",
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year to redeem
      },
    });

    return NextResponse.json({ url: session.url, giftCode });
  } catch (error) {
    console.error("Error creating gift:", error);
    return NextResponse.json(
      { error: "Failed to create gift" },
      { status: 500 }
    );
  }
}
