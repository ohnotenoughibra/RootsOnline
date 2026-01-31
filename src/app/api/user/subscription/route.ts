import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
      select: {
        subscriptionStatus: true,
        subscriptionPriceId: true,
        subscriptionEndsAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Determine plan name from price ID
    let plan: string | null = null;
    if (user.subscriptionPriceId) {
      if (user.subscriptionPriceId === process.env.STRIPE_MONTHLY_PRICE_ID) {
        plan = "Monthly (€19.99/month)";
      } else if (user.subscriptionPriceId === process.env.STRIPE_ANNUAL_PRICE_ID) {
        plan = "Annual (€199/year)";
      } else {
        plan = "Premium";
      }
    }

    return NextResponse.json({
      status: user.subscriptionStatus,
      plan,
      endsAt: user.subscriptionEndsAt?.toISOString() || null,
    });
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription" },
      { status: 500 }
    );
  }
}
