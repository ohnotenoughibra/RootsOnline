import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { nanoid } from "nanoid";

import { prisma } from "@/lib/prisma";

// GET - get affiliate status and stats
export async function GET() {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: {
        affiliate: {
          include: {
            conversions: {
              orderBy: { createdAt: "desc" },
              take: 10,
            },
            payouts: {
              orderBy: { createdAt: "desc" },
              take: 10,
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.affiliate) {
      return NextResponse.json({ enrolled: false });
    }

    return NextResponse.json({
      enrolled: true,
      affiliate: {
        affiliateCode: user.affiliate.affiliateCode,
        commissionRate: user.affiliate.commissionRate,
        status: user.affiliate.status,
        totalReferrals: user.affiliate.totalReferrals,
        totalEarnings: user.affiliate.totalEarnings,
        pendingPayout: user.affiliate.pendingPayout,
        paidOut: user.affiliate.paidOut,
        conversions: user.affiliate.conversions,
        payouts: user.affiliate.payouts,
      },
    });
  } catch (error) {
    console.error("Error getting affiliate status:", error);
    return NextResponse.json(
      { error: "Failed to get affiliate status" },
      { status: 500 }
    );
  }
}

// POST - enroll in affiliate program
export async function POST(request: Request) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { paypalEmail } = await request.json();

    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: { affiliate: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.affiliate) {
      return NextResponse.json(
        { error: "Already enrolled in affiliate program" },
        { status: 400 }
      );
    }

    // Require active subscription to become affiliate
    if (user.subscriptionStatus !== "ACTIVE") {
      return NextResponse.json(
        { error: "Active subscription required to become an affiliate" },
        { status: 400 }
      );
    }

    // Generate unique affiliate code
    const affiliateCode = `ROA-${nanoid(8).toUpperCase()}`;

    const affiliate = await prisma.affiliate.create({
      data: {
        userId: user.id,
        affiliateCode,
        paypalEmail,
        status: "ACTIVE", // Auto-approve for active subscribers
      },
    });

    return NextResponse.json({
      success: true,
      affiliateCode: affiliate.affiliateCode,
    });
  } catch (error) {
    console.error("Error enrolling in affiliate program:", error);
    return NextResponse.json(
      { error: "Failed to enroll in affiliate program" },
      { status: 500 }
    );
  }
}

// PATCH - update affiliate settings
export async function PATCH(request: Request) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { paypalEmail } = await request.json();

    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: { affiliate: true },
    });

    if (!user || !user.affiliate) {
      return NextResponse.json(
        { error: "Not enrolled in affiliate program" },
        { status: 404 }
      );
    }

    await prisma.affiliate.update({
      where: { id: user.affiliate.id },
      data: { paypalEmail },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating affiliate settings:", error);
    return NextResponse.json(
      { error: "Failed to update affiliate settings" },
      { status: 500 }
    );
  }
}
