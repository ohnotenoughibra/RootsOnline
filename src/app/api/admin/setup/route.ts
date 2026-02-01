import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// One-time admin setup endpoint
// Use: POST /api/admin/setup with header X-Setup-Secret
// After first admin is created, this endpoint is disabled

export async function POST(request: Request) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Please sign in first" }, { status: 401 });
    }

    // Check setup secret from header
    const setupSecret = request.headers.get("x-setup-secret");
    const expectedSecret = process.env.ADMIN_SETUP_SECRET || "ROA-SETUP-2026";

    if (setupSecret !== expectedSecret) {
      return NextResponse.json({ error: "Invalid setup secret" }, { status: 403 });
    }

    // Check if any admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: "ADMIN" },
    });

    if (existingAdmin) {
      return NextResponse.json(
        { error: "Admin already exists. This endpoint is disabled." },
        { status: 400 }
      );
    }

    // Get current user
    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found in database" }, { status: 404 });
    }

    // Promote to admin
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { role: "ADMIN" },
    });

    return NextResponse.json({
      success: true,
      message: "You are now an admin!",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.error("Admin setup error:", error);
    return NextResponse.json(
      { error: "Failed to setup admin" },
      { status: 500 }
    );
  }
}

// GET to check setup status
export async function GET() {
  try {
    const existingAdmin = await prisma.user.findFirst({
      where: { role: "ADMIN" },
      select: { email: true },
    });

    return NextResponse.json({
      adminExists: !!existingAdmin,
      setupAvailable: !existingAdmin,
    });
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
