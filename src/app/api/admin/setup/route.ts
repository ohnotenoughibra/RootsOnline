import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Admin setup endpoint
// Mode 1 (initial): POST with X-Setup-Secret header to become first admin
// Mode 2 (promote): POST with { email, role } body when already admin to promote others

export async function POST(request: Request) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Please sign in first" }, { status: 401 });
    }

    // Get current user
    const currentUser = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found in database" }, { status: 404 });
    }

    // Check if any admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: "ADMIN" },
    });

    // Mode 1: Initial admin setup (no admin exists yet)
    if (!existingAdmin) {
      const setupSecret = request.headers.get("x-setup-secret");
      const expectedSecret = process.env.ADMIN_SETUP_SECRET || "ROA-SETUP-2026";

      if (setupSecret !== expectedSecret) {
        return NextResponse.json({ error: "Invalid setup secret" }, { status: 403 });
      }

      const updatedUser = await prisma.user.update({
        where: { id: currentUser.id },
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
    }

    // Mode 2: Admin promoting others (admin already exists)
    if (currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    // Parse body for email/role to promote
    const body = await request.json().catch(() => ({}));
    const { email, role } = body;

    if (!email) {
      return NextResponse.json({
        error: "Admin already exists. To promote users, provide { email, role } in body.",
        hint: "Valid roles: ADMIN, COACH, STUDENT"
      }, { status: 400 });
    }

    const validRoles = ["ADMIN", "COACH", "STUDENT"];
    const targetRole = role || "ADMIN";
    if (!validRoles.includes(targetRole)) {
      return NextResponse.json({ error: "Invalid role. Must be ADMIN, COACH, or STUDENT" }, { status: 400 });
    }

    const targetUser = await prisma.user.findFirst({
      where: { email: email.toLowerCase().trim() },
    });

    if (!targetUser) {
      return NextResponse.json({ error: `User not found: ${email}` }, { status: 404 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: targetUser.id },
      data: { role: targetRole },
    });

    return NextResponse.json({
      success: true,
      message: `${updatedUser.email} is now ${targetRole}!`,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
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

// GET to check setup status and list admins/coaches
export async function GET() {
  try {
    const admins = await prisma.user.findMany({
      where: { role: "ADMIN" },
      select: { email: true, firstName: true, lastName: true },
    });

    const coaches = await prisma.user.findMany({
      where: { role: "COACH" },
      select: { email: true, firstName: true, lastName: true },
    });

    return NextResponse.json({
      adminExists: admins.length > 0,
      setupAvailable: admins.length === 0,
      admins,
      coaches,
    });
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
