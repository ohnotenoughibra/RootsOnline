import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

// POST - validate a promo code
export async function POST(request: Request) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: "Promo code is required" },
        { status: 400 }
      );
    }

    const promoCode = await prisma.promoCode.findUnique({
      where: { code: code.toUpperCase().trim() },
    });

    if (!promoCode) {
      return NextResponse.json(
        { valid: false, error: "Invalid promo code" },
        { status: 200 }
      );
    }

    // Check if active
    if (!promoCode.isActive) {
      return NextResponse.json(
        { valid: false, error: "This promo code is no longer active" },
        { status: 200 }
      );
    }

    // Check validity dates
    const now = new Date();
    if (promoCode.validFrom > now) {
      return NextResponse.json(
        { valid: false, error: "This promo code is not yet active" },
        { status: 200 }
      );
    }

    if (promoCode.validUntil && promoCode.validUntil < now) {
      return NextResponse.json(
        { valid: false, error: "This promo code has expired" },
        { status: 200 }
      );
    }

    // Check usage limit
    if (promoCode.maxUses && promoCode.usedCount >= promoCode.maxUses) {
      return NextResponse.json(
        { valid: false, error: "This promo code has reached its usage limit" },
        { status: 200 }
      );
    }

    // Calculate discount
    const discountDisplay =
      promoCode.discountType === "PERCENT"
        ? `${promoCode.discountAmount}% off`
        : `€${(promoCode.discountAmount / 100).toFixed(2)} off`;

    return NextResponse.json({
      valid: true,
      code: promoCode.code,
      discountType: promoCode.discountType,
      discountAmount: promoCode.discountAmount,
      discountDisplay,
      description: promoCode.description,
    });
  } catch (error) {
    console.error("Error validating promo code:", error);
    return NextResponse.json(
      { error: "Failed to validate promo code" },
      { status: 500 }
    );
  }
}
