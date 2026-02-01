import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { prisma } from "@/lib/prisma";
import { sendPushNotificationToUser } from "@/lib/send-push-notification";

export const dynamic = "force-dynamic";

// This cron job runs weekly to re-engage inactive users
// Configure in vercel.json or cron provider
export async function GET(request: Request) {
  try {
    // Verify cron secret for security
    const headersList = await headers();
    const cronSecret = headersList.get("x-cron-secret");

    if (cronSecret !== process.env.CRON_SECRET) {
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const now = new Date();
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    // Get users with their last activity
    const inactiveUsers = await prisma.user.findMany({
      where: {
        subscriptionStatus: { in: ["ACTIVE", "TRIALING"] },
        updatedAt: { lt: threeDaysAgo },
      },
      select: {
        id: true,
        firstName: true,
        updatedAt: true,
        lessonProgress: {
          orderBy: { updatedAt: "desc" },
          take: 1,
          select: { updatedAt: true },
        },
        pushSubscription: {
          select: { reminderNotifications: true },
        },
      },
    });

    let notificationsSent = 0;
    const results: Array<{ userId: string; type: string; sent: boolean }> = [];

    for (const user of inactiveUsers) {
      // Skip if no push subscription or reminders disabled
      if (!user.pushSubscription?.reminderNotifications) {
        continue;
      }

      const lastActivity = user.lessonProgress[0]?.updatedAt || user.updatedAt;
      let notificationPayload;
      let notificationType: string;

      if (lastActivity < fourteenDaysAgo) {
        // Very inactive - 14+ days
        notificationPayload = {
          title: "We Miss You! 🥋",
          body: `${user.firstName || "Hey"}, your training is waiting. New courses have been added since you've been away.`,
          url: "/courses",
          tag: "reengagement-14",
        };
        notificationType = "14-day";
      } else if (lastActivity < sevenDaysAgo) {
        // Moderately inactive - 7-14 days
        notificationPayload = {
          title: "Ready to Train? 💪",
          body: "It's been a week since your last session. Jump back in and keep progressing!",
          url: "/dashboard",
          tag: "reengagement-7",
        };
        notificationType = "7-day";
      } else if (lastActivity < threeDaysAgo) {
        // Slightly inactive - 3-7 days
        notificationPayload = {
          title: "Time to Train! 🔥",
          body: "Pick up where you left off. Your next lesson is waiting.",
          url: "/dashboard",
          tag: "reengagement-3",
        };
        notificationType = "3-day";
      } else {
        continue;
      }

      const sent = await sendPushNotificationToUser(
        user.id,
        notificationPayload,
        "streak_reminder"
      );

      results.push({ userId: user.id, type: notificationType, sent });
      if (sent) notificationsSent++;
    }

    return NextResponse.json({
      success: true,
      usersChecked: inactiveUsers.length,
      notificationsSent,
      results: results.slice(0, 10), // Return first 10 for debugging
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error sending re-engagement notifications:", error);
    return NextResponse.json(
      { error: "Failed to send notifications" },
      { status: 500 }
    );
  }
}
