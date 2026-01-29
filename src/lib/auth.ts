import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "./prisma";
import type { Role, SubscriptionStatus } from "@prisma/client";

// Get or create user in database from Clerk
export async function getOrCreateDbUser() {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  const clerkUser = await currentUser();

  if (!clerkUser) {
    return null;
  }

  // Try to find existing user
  let user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  // Create if doesn't exist
  if (!user) {
    user = await prisma.user.create({
      data: {
        clerkId: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress || "",
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        imageUrl: clerkUser.imageUrl,
        role: "STUDENT",
        subscriptionStatus: "INACTIVE",
      },
    });
  }

  return user;
}

// Get current user with full data
export async function getCurrentUser() {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  return user;
}

// Check if user has active subscription
export async function hasActiveSubscription(): Promise<boolean> {
  const user = await getCurrentUser();

  if (!user) {
    return false;
  }

  const activeStatuses: SubscriptionStatus[] = ["ACTIVE", "TRIALING"];
  return activeStatuses.includes(user.subscriptionStatus);
}

// Check if user is a coach
export async function isCoach(): Promise<boolean> {
  const user = await getCurrentUser();

  if (!user) {
    return false;
  }

  const coachRoles: Role[] = ["COACH", "ADMIN"];
  return coachRoles.includes(user.role);
}

// Check if user is an admin
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();

  if (!user) {
    return false;
  }

  return user.role === "ADMIN";
}

// Update user role (admin only)
export async function updateUserRole(userId: string, role: Role) {
  const currentUserData = await getCurrentUser();

  if (!currentUserData || currentUserData.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required");
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { role },
  });

  return user;
}

// Sync user data from Clerk webhook
export async function syncUserFromClerk(clerkUserId: string, data: {
  email?: string;
  firstName?: string | null;
  lastName?: string | null;
  imageUrl?: string;
}) {
  const user = await prisma.user.upsert({
    where: { clerkId: clerkUserId },
    update: data,
    create: {
      clerkId: clerkUserId,
      email: data.email || "",
      firstName: data.firstName,
      lastName: data.lastName,
      imageUrl: data.imageUrl,
    },
  });

  return user;
}
