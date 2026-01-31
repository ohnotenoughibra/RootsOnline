import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

// POST - manually activate a subscription (admin only)
export async function POST(request: Request) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if current user is admin
    const currentUser = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { userId, plan, months } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Find the target user
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate subscription end date
    const durationMonths = months || (plan === "annual" ? 12 : 1);
    const subscriptionEndsAt = new Date();
    subscriptionEndsAt.setMonth(subscriptionEndsAt.getMonth() + durationMonths);

    // Activate subscription
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionStatus: "ACTIVE",
        subscriptionId: `manual_${Date.now()}`,
        subscriptionPriceId: plan === "annual" ? "sepa_annual" : "sepa_custom",
        subscriptionEndsAt,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        subscriptionStatus: updatedUser.subscriptionStatus,
        subscriptionEndsAt: updatedUser.subscriptionEndsAt,
      },
    });
  } catch (error) {
    console.error("Error activating subscription:", error);
    return NextResponse.json(
      { error: "Failed to activate subscription" },
      { status: 500 }
    );
  }
}

// GET - list users pending SEPA activation (admin only)
export async function GET() {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if current user is admin
    const currentUser = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    // Get all inactive users (potential SEPA payers)
    const users = await prisma.user.findMany({
      where: {
        subscriptionStatus: "INACTIVE",
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
