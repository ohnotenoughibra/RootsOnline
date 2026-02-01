import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { prisma } from "@/lib/prisma";
import {
  sendPushNotificationToUser,
  streakReminderNotification,
} from "@/lib/send-push-notification";

export const dynamic = "force-dynamic";

// This cron job runs daily at 6 PM to remind users to train
// Configure in vercel.json or cron provider
export async function GET(request: Request) {
  try {
    // Verify cron secret for security - REQUIRED
    const headersList = await headers();
    const authHeader = headersList.get("authorization");
    const cronSecretHeader = headersList.get("x-cron-secret");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret) {
      console.error("CRON_SECRET environment variable is not set");
      return NextResponse.json({ error: "Cron endpoint not configured" }, { status: 500 });
    }

    // Support both Authorization: Bearer and x-cron-secret headers
    const providedSecret = authHeader?.replace("Bearer ", "") || cronSecretHeader;
    if (providedSecret !== cronSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find users who:
    // 1. Have an active streak
    // 2. Haven't trained today
    // 3. Have push notifications enabled
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const usersWithStreaks = await prisma.trainingStreak.findMany({
      where: {
        currentStreak: { gt: 0 },
        // Last active was yesterday (at risk of losing streak)
        lastActiveAt: {
          lt: today,
          gte: new Date(today.getTime() - 24 * 60 * 60 * 1000), // Within last 24 hours
        },
      },
      include: {
        user: {
          select: {
            id: true,
            subscriptionStatus: true,
          },
        },
      },
    });

    let notificationsSent = 0;

    for (const streak of usersWithStreaks) {
      // Only send to active subscribers
      if (!["ACTIVE", "TRIALING"].includes(streak.user.subscriptionStatus)) {
        continue;
      }

      const payload = streakReminderNotification(streak.currentStreak);
      const sent = await sendPushNotificationToUser(
        streak.userId,
        payload,
        "streak_reminder"
      );

      if (sent) {
        notificationsSent++;
      }
    }

    return NextResponse.json({
      success: true,
      usersChecked: usersWithStreaks.length,
      notificationsSent,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error sending streak reminders:", error);
    return NextResponse.json(
      { error: "Failed to send reminders" },
      { status: 500 }
    );
  }
}
