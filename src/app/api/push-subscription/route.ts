import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

// POST - save push subscription
export async function POST(request: Request) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { subscription, preferences } = await request.json();

    if (!subscription) {
      return NextResponse.json(
        { error: "Subscription data required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Upsert push subscription
    await prisma.pushSubscription.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        newCourseNotifications: preferences?.newCourses ?? true,
        feedbackNotifications: preferences?.feedback ?? true,
        reminderNotifications: preferences?.reminders ?? true,
        marketingNotifications: preferences?.marketing ?? false,
      },
      update: {
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        ...(preferences && {
          newCourseNotifications: preferences.newCourses,
          feedbackNotifications: preferences.feedback,
          reminderNotifications: preferences.reminders,
          marketingNotifications: preferences.marketing,
        }),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving push subscription:", error);
    return NextResponse.json(
      { error: "Failed to save subscription" },
      { status: 500 }
    );
  }
}

// GET - get push subscription status
export async function GET() {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: {
        pushSubscription: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.pushSubscription) {
      return NextResponse.json({ subscribed: false });
    }

    return NextResponse.json({
      subscribed: true,
      preferences: {
        newCourses: user.pushSubscription.newCourseNotifications,
        feedback: user.pushSubscription.feedbackNotifications,
        reminders: user.pushSubscription.reminderNotifications,
        marketing: user.pushSubscription.marketingNotifications,
      },
    });
  } catch (error) {
    console.error("Error getting push subscription:", error);
    return NextResponse.json(
      { error: "Failed to get subscription" },
      { status: 500 }
    );
  }
}

// DELETE - remove push subscription
export async function DELETE() {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await prisma.pushSubscription.deleteMany({
      where: { userId: user.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting push subscription:", error);
    return NextResponse.json(
      { error: "Failed to delete subscription" },
      { status: 500 }
    );
  }
}

// PATCH - update preferences
export async function PATCH(request: Request) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { preferences } = await request.json();

    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await prisma.pushSubscription.update({
      where: { userId: user.id },
      data: {
        newCourseNotifications: preferences.newCourses,
        feedbackNotifications: preferences.feedback,
        reminderNotifications: preferences.reminders,
        marketingNotifications: preferences.marketing,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating preferences:", error);
    return NextResponse.json(
      { error: "Failed to update preferences" },
      { status: 500 }
    );
  }
}
