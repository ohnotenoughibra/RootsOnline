import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

// POST - validate a promo code
export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: "Promo code is required" },
        { status: 400 }
      );
    }

    const promoCode = await prisma.promoCode.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!promoCode) {
      return NextResponse.json(
        { error: "Invalid promo code", valid: false },
        { status: 404 }
      );
    }

    // Check if active
    if (!promoCode.isActive) {
      return NextResponse.json(
        { error: "This promo code is no longer active", valid: false },
        { status: 400 }
      );
    }

    // Check validity dates
    const now = new Date();
    if (promoCode.validFrom > now) {
      return NextResponse.json(
        { error: "This promo code is not yet valid", valid: false },
        { status: 400 }
      );
    }

    if (promoCode.validUntil && promoCode.validUntil < now) {
      return NextResponse.json(
        { error: "This promo code has expired", valid: false },
        { status: 400 }
      );
    }

    // Check usage limit
    if (promoCode.maxUses && promoCode.usedCount >= promoCode.maxUses) {
      return NextResponse.json(
        { error: "This promo code has reached its usage limit", valid: false },
        { status: 400 }
      );
    }

    // Code is valid
    return NextResponse.json({
      valid: true,
      code: promoCode.code,
      discountType: promoCode.discountType,
      discountAmount: promoCode.discountAmount,
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
