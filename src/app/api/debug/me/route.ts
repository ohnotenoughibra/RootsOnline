import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Debug endpoint to check current user data
// Visit /api/debug/me while logged in to see your user record
export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    const clerkUser = await currentUser();

    if (!clerkId) {
      return NextResponse.json({
        error: "Not logged in",
        clerkId: null,
      });
    }

    // Find user by clerkId (how the app actually looks up users)
    const userByClerkId = await prisma.user.findUnique({
      where: { clerkId },
    });

    // Also find by email to compare
    const email = clerkUser?.emailAddresses[0]?.emailAddress;
    const userByEmail = email
      ? await prisma.user.findFirst({ where: { email } })
      : null;

    return NextResponse.json({
      clerkId,
      clerkEmail: email,
      userByClerkId: userByClerkId
        ? {
            id: userByClerkId.id,
            email: userByClerkId.email,
            role: userByClerkId.role,
            subscriptionStatus: userByClerkId.subscriptionStatus,
            clerkId: userByClerkId.clerkId,
          }
        : null,
      userByEmail: userByEmail
        ? {
            id: userByEmail.id,
            email: userByEmail.email,
            role: userByEmail.role,
            subscriptionStatus: userByEmail.subscriptionStatus,
            clerkId: userByEmail.clerkId,
          }
        : null,
      mismatch: userByClerkId?.id !== userByEmail?.id,
      issue: !userByClerkId
        ? "No user found by clerkId - user sync may have failed"
        : userByClerkId.role !== "ADMIN" && userByClerkId.role !== "COACH"
        ? `User role is ${userByClerkId.role}, not ADMIN or COACH`
        : null,
    });
  } catch (error) {
    console.error("Debug error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
