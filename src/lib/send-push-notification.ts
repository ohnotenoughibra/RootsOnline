import webpush from "web-push";
import { prisma } from "./prisma";

// Configure VAPID keys
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;

// Only configure web-push if valid VAPID keys are provided
// VAPID private key should be 32 bytes (43 base64 chars without padding)
const isPushConfigured =
  vapidPublicKey &&
  vapidPrivateKey &&
  vapidPrivateKey.length >= 40 &&
  !vapidPrivateKey.includes("xxxxx");

if (isPushConfigured) {
  try {
    webpush.setVapidDetails(
      "mailto:support@rootsonlineacademy.com",
      vapidPublicKey!,
      vapidPrivateKey!
    );
  } catch (error) {
    console.warn("Failed to configure web-push VAPID details:", error);
  }
}

export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  url?: string;
  tag?: string;
}

export type NotificationType =
  | "new_course"
  | "feedback_received"
  | "streak_reminder"
  | "course_completed"
  | "certificate_ready"
  | "marketing";

/**
 * Send push notification to a specific user
 */
export async function sendPushNotificationToUser(
  userId: string,
  payload: PushNotificationPayload,
  notificationType: NotificationType
): Promise<boolean> {
  // Skip if push notifications are not configured
  if (!isPushConfigured) {
    return false;
  }

  try {
    const subscription = await prisma.pushSubscription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      return false;
    }

    // Check notification preferences
    const shouldSend = checkNotificationPreference(subscription, notificationType);
    if (!shouldSend) {
      return false;
    }

    const pushSubscription = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.p256dh,
        auth: subscription.auth,
      },
    };

    const notificationPayload = JSON.stringify({
      title: payload.title,
      body: payload.body,
      icon: payload.icon || "/icon-192.png",
      badge: payload.badge || "/badge-72.png",
      data: {
        url: payload.url || "/dashboard",
      },
      tag: payload.tag,
    });

    await webpush.sendNotification(pushSubscription, notificationPayload);
    return true;
  } catch (error) {
    console.error("Failed to send push notification:", error);

    // If subscription is invalid, delete it
    if (error instanceof webpush.WebPushError && error.statusCode === 410) {
      await prisma.pushSubscription.delete({
        where: { userId },
      }).catch(() => {});
    }

    return false;
  }
}

/**
 * Check if user has enabled this type of notification
 */
function checkNotificationPreference(
  subscription: {
    newCourseNotifications: boolean;
    feedbackNotifications: boolean;
    reminderNotifications: boolean;
    marketingNotifications: boolean;
  },
  notificationType: NotificationType
): boolean {
  switch (notificationType) {
    case "new_course":
      return subscription.newCourseNotifications;
    case "feedback_received":
    case "course_completed":
    case "certificate_ready":
      return subscription.feedbackNotifications;
    case "streak_reminder":
      return subscription.reminderNotifications;
    case "marketing":
      return subscription.marketingNotifications;
    default:
      return true;
  }
}

/**
 * Send notification to all subscribed users
 */
export async function sendPushNotificationToAll(
  payload: PushNotificationPayload,
  notificationType: NotificationType,
  filter?: { role?: string }
): Promise<number> {
  const subscriptions = await prisma.pushSubscription.findMany({
    include: {
      user: {
        select: { role: true },
      },
    },
  });

  let sentCount = 0;

  for (const sub of subscriptions) {
    if (filter?.role && sub.user.role !== filter.role) {
      continue;
    }

    const sent = await sendPushNotificationToUser(sub.userId, payload, notificationType);
    if (sent) sentCount++;
  }

  return sentCount;
}

// Predefined notification templates

export function newCourseNotification(courseTitle: string, courseSlug: string): PushNotificationPayload {
  return {
    title: "New Course Available! 🥋",
    body: `${courseTitle} is now available. Start learning today!`,
    url: `/courses/${courseSlug}`,
    tag: "new-course",
  };
}

export function feedbackReceivedNotification(coachName: string): PushNotificationPayload {
  return {
    title: "You've Got Feedback! 📹",
    body: `${coachName} reviewed your training footage. Check out their feedback.`,
    url: "/dashboard/footage",
    tag: "feedback",
  };
}

export function streakReminderNotification(currentStreak: number): PushNotificationPayload {
  return {
    title: `Keep Your ${currentStreak}-Day Streak! 🔥`,
    body: "Don't forget to train today. Your streak is on the line!",
    url: "/dashboard",
    tag: "streak-reminder",
  };
}

export function courseCompletedNotification(courseTitle: string): PushNotificationPayload {
  return {
    title: "Course Completed! 🎉",
    body: `Congratulations! You've completed ${courseTitle}. Your certificate is ready.`,
    url: "/dashboard/certificates",
    tag: "course-completed",
  };
}

export function certificateReadyNotification(courseTitle: string): PushNotificationPayload {
  return {
    title: "Certificate Ready! 🏆",
    body: `Your certificate for ${courseTitle} is ready to download.`,
    url: "/dashboard/certificates",
    tag: "certificate-ready",
  };
}

export function weeklyDigestNotification(lessonsCompleted: number): PushNotificationPayload {
  return {
    title: "Your Weekly Training Summary 📊",
    body: `You completed ${lessonsCompleted} lessons this week. Keep up the great work!`,
    url: "/dashboard",
    tag: "weekly-digest",
  };
}
