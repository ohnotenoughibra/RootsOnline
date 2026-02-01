import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * Generate a random promo code
 */
function generatePromoCode(prefix: string, length: number = 6): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Removed confusing chars like 0/O, 1/I
  let code = prefix ? `${prefix}-` : "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// POST - Bulk generate promo codes
export async function POST(request: Request) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify admin role
    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await request.json();
    const {
      count = 1,
      prefix = "ROA",
      description,
      discountType = "PERCENT",
      discountAmount,
      maxUses = 1, // Default to single-use for bulk codes
      validFrom,
      validUntil,
    } = body;

    // Validate
    if (count < 1 || count > 100) {
      return NextResponse.json(
        { error: "Count must be between 1 and 100" },
        { status: 400 }
      );
    }

    if (discountAmount === undefined) {
      return NextResponse.json(
        { error: "Discount amount is required" },
        { status: 400 }
      );
    }

    if (discountType === "PERCENT" && (discountAmount < 1 || discountAmount > 100)) {
      return NextResponse.json(
        { error: "Percentage discount must be between 1 and 100" },
        { status: 400 }
      );
    }

    // Generate unique codes
    const codes: string[] = [];
    const existingCodes = new Set(
      (await prisma.promoCode.findMany({ select: { code: true } })).map((p) => p.code)
    );

    let attempts = 0;
    while (codes.length < count && attempts < count * 10) {
      const newCode = generatePromoCode(prefix);
      if (!existingCodes.has(newCode) && !codes.includes(newCode)) {
        codes.push(newCode);
      }
      attempts++;
    }

    if (codes.length < count) {
      return NextResponse.json(
        { error: "Could not generate enough unique codes" },
        { status: 500 }
      );
    }

    // Create all codes in a transaction
    const promoCodes = await prisma.$transaction(
      codes.map((code) =>
        prisma.promoCode.create({
          data: {
            code,
            description: description || `Bulk generated code`,
            discountType,
            discountAmount,
            maxUses,
            validFrom: validFrom ? new Date(validFrom) : new Date(),
            validUntil: validUntil ? new Date(validUntil) : null,
            isActive: true,
          },
        })
      )
    );

    return NextResponse.json({
      success: true,
      count: promoCodes.length,
      codes: promoCodes,
    }, { status: 201 });
  } catch (error) {
    console.error("Error bulk creating promo codes:", error);
    return NextResponse.json(
      { error: "Failed to create promo codes" },
      { status: 500 }
    );
  }
}
