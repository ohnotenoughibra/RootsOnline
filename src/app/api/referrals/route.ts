import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

function generateReferralCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// GET referral info for current user
export async function GET() {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get or create referral code
    let referral = await prisma.referral.findFirst({
      where: {
        referrerId: user.id,
        referredUserId: null, // Find unused referral code
      },
    });

    if (!referral) {
      referral = await prisma.referral.create({
        data: {
          referrerId: user.id,
          referralCode: generateReferralCode(),
        },
      });
    }

    // Get all successful referrals
    const successfulReferrals = await prisma.referral.findMany({
      where: {
        referrerId: user.id,
        status: "COMPLETED",
      },
      include: {
        referredUser: {
          select: {
            firstName: true,
            lastName: true,
            createdAt: true,
          },
        },
      },
    });

    // Get pending referrals
    const pendingReferrals = await prisma.referral.findMany({
      where: {
        referrerId: user.id,
        status: "PENDING",
        referredUserId: { not: null },
      },
    });

    const totalEarned = successfulReferrals.reduce(
      (sum, r) => sum + r.rewardAmount,
      0
    );

    return NextResponse.json({
      referralCode: referral.referralCode,
      referralLink: `${process.env.NEXT_PUBLIC_APP_URL || ""}/sign-up?ref=${referral.referralCode}`,
      successfulReferrals: successfulReferrals.length,
      pendingReferrals: pendingReferrals.length,
      totalEarned,
      referrals: successfulReferrals,
    });
  } catch (error) {
    console.error("Error fetching referrals:", error);
    return NextResponse.json(
      { error: "Failed to fetch referrals" },
      { status: 500 }
    );
  }
}

// POST - validate referral code during signup
export async function POST(request: Request) {
  try {
    const { referralCode, userId } = await request.json();

    if (!referralCode) {
      return NextResponse.json(
        { error: "Referral code is required" },
        { status: 400 }
      );
    }

    // Find referral by code
    const referral = await prisma.referral.findUnique({
      where: { referralCode: referralCode.toUpperCase() },
    });

    if (!referral) {
      return NextResponse.json(
        { error: "Invalid referral code" },
        { status: 404 }
      );
    }

    if (referral.referredUserId) {
      return NextResponse.json(
        { error: "Referral code already used" },
        { status: 400 }
      );
    }

    // If userId provided, link the referral
    if (userId) {
      // Make sure user isn't referring themselves
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user && user.id === referral.referrerId) {
        return NextResponse.json(
          { error: "Cannot refer yourself" },
          { status: 400 }
        );
      }

      await prisma.referral.update({
        where: { id: referral.id },
        data: {
          referredUserId: userId,
        },
      });

      // Create new referral code for the referrer
      await prisma.referral.create({
        data: {
          referrerId: referral.referrerId,
          referralCode: generateReferralCode(),
        },
      });
    }

    return NextResponse.json({
      valid: true,
      referrerId: referral.referrerId,
    });
  } catch (error) {
    console.error("Error validating referral:", error);
    return NextResponse.json(
      { error: "Failed to validate referral" },
      { status: 500 }
    );
  }
}
