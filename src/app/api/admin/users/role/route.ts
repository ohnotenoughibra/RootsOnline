import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Admin endpoint to manage user roles
// POST: Update a user's role (ADMIN, COACH, STUDENT)

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

    const { email, role } = await request.json();

    if (!email || !role) {
      return NextResponse.json({ error: "Email and role required" }, { status: 400 });
    }

    const validRoles = ["ADMIN", "COACH", "STUDENT"];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role. Must be ADMIN, COACH, or STUDENT" }, { status: 400 });
    }

    // Find user by email
    const targetUser = await prisma.user.findFirst({
      where: { email: email.toLowerCase().trim() },
    });

    if (!targetUser) {
      return NextResponse.json({ error: `User not found: ${email}` }, { status: 404 });
    }

    // Update role
    const updatedUser = await prisma.user.update({
      where: { id: targetUser.id },
      data: { role },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.error("Role update error:", error);
    return NextResponse.json({ error: "Failed to update role" }, { status: 500 });
  }
}

// GET: List all users with their roles
export async function GET(request: Request) {
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

    const url = new URL(request.url);
    const roleFilter = url.searchParams.get("role");

    const users = await prisma.user.findMany({
      where: roleFilter ? { role: roleFilter as "ADMIN" | "COACH" | "STUDENT" } : undefined,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        imageUrl: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("User list error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
