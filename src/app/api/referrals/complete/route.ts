import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

// POST - complete referral when user subscribes
export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Find pending referral for this user
    const referral = await prisma.referral.findFirst({
      where: {
        referredUserId: userId,
        status: "PENDING",
      },
    });

    if (!referral) {
      return NextResponse.json(
        { message: "No pending referral found" },
        { status: 200 }
      );
    }

    // Complete the referral
    await prisma.referral.update({
      where: { id: referral.id },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      reward: referral.rewardAmount,
    });
  } catch (error) {
    console.error("Error completing referral:", error);
    return NextResponse.json(
      { error: "Failed to complete referral" },
      { status: 500 }
    );
  }
}
