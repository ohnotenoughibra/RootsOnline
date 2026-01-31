import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

// POST - redeem a gift subscription
export async function POST(request: Request) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ error: "Gift code required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find the gift
    const gift = await prisma.giftSubscription.findUnique({
      where: { giftCode: code.toUpperCase().trim() },
    });

    if (!gift) {
      return NextResponse.json(
        { error: "Invalid gift code" },
        { status: 404 }
      );
    }

    // Check if already redeemed
    if (gift.status === "REDEEMED") {
      return NextResponse.json(
        { error: "This gift has already been redeemed" },
        { status: 400 }
      );
    }

    // Check if expired
    if (gift.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "This gift code has expired" },
        { status: 400 }
      );
    }

    // Check if gift was paid for (has Stripe payment ID)
    if (!gift.stripePaymentId) {
      return NextResponse.json(
        { error: "This gift has not been paid for yet" },
        { status: 400 }
      );
    }

    // Calculate subscription end date based on duration
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + gift.duration);

    // Update user's subscription
    await prisma.$transaction([
      // Update user subscription
      prisma.user.update({
        where: { id: user.id },
        data: {
          subscriptionStatus: "ACTIVE",
          subscriptionEndsAt: endDate,
        },
      }),
      // Mark gift as redeemed
      prisma.giftSubscription.update({
        where: { id: gift.id },
        data: {
          status: "REDEEMED",
          recipientId: user.id,
          redeemedAt: new Date(),
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Gift subscription activated!",
      duration: gift.duration,
      expiresAt: endDate,
    });
  } catch (error) {
    console.error("Error redeeming gift:", error);
    return NextResponse.json(
      { error: "Failed to redeem gift" },
      { status: 500 }
    );
  }
}

// GET - validate a gift code
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json({ error: "Code required" }, { status: 400 });
    }

    const gift = await prisma.giftSubscription.findUnique({
      where: { giftCode: code.toUpperCase().trim() },
      include: {
        purchaser: {
          select: { firstName: true },
        },
      },
    });

    if (!gift) {
      return NextResponse.json({ valid: false, error: "Invalid gift code" });
    }

    if (gift.status === "REDEEMED") {
      return NextResponse.json({
        valid: false,
        error: "Already redeemed",
      });
    }

    if (gift.expiresAt < new Date()) {
      return NextResponse.json({ valid: false, error: "Expired" });
    }

    if (!gift.stripePaymentId) {
      return NextResponse.json({
        valid: false,
        error: "Payment not completed",
      });
    }

    return NextResponse.json({
      valid: true,
      plan: gift.plan,
      duration: gift.duration,
      message: gift.message,
      from: gift.purchaser?.firstName || "A friend",
    });
  } catch (error) {
    console.error("Error validating gift:", error);
    return NextResponse.json(
      { error: "Failed to validate gift" },
      { status: 500 }
    );
  }
}
