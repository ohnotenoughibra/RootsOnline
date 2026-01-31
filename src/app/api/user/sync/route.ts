import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";
import { sendEmail, welcomeEmail } from "@/lib/email";

export async function POST() {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized - not signed in" }, { status: 401 });
    }

    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json({ error: "Clerk user not found" }, { status: 404 });
    }

    const email = clerkUser.emailAddresses[0]?.emailAddress || "";

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    // Upsert user in database
    const user = await prisma.user.upsert({
      where: { clerkId: userId },
      update: {
        email,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        imageUrl: clerkUser.imageUrl,
      },
      create: {
        clerkId: userId,
        email,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        imageUrl: clerkUser.imageUrl,
        role: "STUDENT",
        subscriptionStatus: "INACTIVE",
      },
    });

    // Send welcome email for new users
    if (!existingUser && email) {
      const welcomeEmailContent = welcomeEmail({
        firstName: clerkUser.firstName || "there",
      });
      await sendEmail({ to: email, ...welcomeEmailContent });
    }

    return NextResponse.json({ user, success: true });
  } catch (error) {
    console.error("Error syncing user:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to sync user", details: message },
      { status: 500 }
    );
  }
}
