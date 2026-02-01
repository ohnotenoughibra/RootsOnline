import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { prisma } from "@/lib/prisma";
import { sendEmail, weeklyDigestEmail, isEmailConfigured } from "@/lib/email";

// Vercel Cron - runs every Sunday at 9am UTC
// cron: 0 9 * * 0

export async function GET(request: Request) {
  try {
    // Verify cron secret for security - REQUIRED in production
    const headersList = await headers();
    const authHeader = headersList.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret) {
      console.error("CRON_SECRET environment variable is not set");
      return NextResponse.json({ error: "Cron endpoint not configured" }, { status: 500 });
    }

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isEmailConfigured()) {
      return NextResponse.json(
        { error: "Email not configured" },
        { status: 503 }
      );
    }

    // Get active subscribers who want digest emails
    const users = await prisma.user.findMany({
      where: {
        subscriptionStatus: "ACTIVE",
        email: { not: "" },
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lessonProgress: {
          where: {
            updatedAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
            },
          },
          include: {
            lesson: {
              include: {
                module: {
                  include: {
                    course: true,
                  },
                },
              },
            },
          },
        },
        streaks: {
          take: 1,
        },
      },
    });

    // Get new courses from the past week
    const newCourses = await prisma.course.findMany({
      where: {
        status: "PUBLISHED",
        publishedAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
      select: {
        title: true,
        discipline: true,
      },
      take: 5,
    });

    let sentCount = 0;
    let errorCount = 0;

    for (const user of users) {
      try {
        // Calculate stats for this user
        const lessonsWatched = user.lessonProgress.filter(
          (p: { completed: boolean }) => p.completed
        ).length;
        const totalWatchedSeconds = user.lessonProgress.reduce(
          (sum: number, p: { watchedSeconds: number }) => sum + p.watchedSeconds,
          0
        );
        const totalWatchTime = formatWatchTime(totalWatchedSeconds);
        const streakDays = user.streaks[0]?.currentStreak || 0;

        // Get courses in progress - batch query for lesson counts to avoid N+1
        type LessonProgressItem = (typeof user.lessonProgress)[number];
        const courseIds = [...new Set(
          user.lessonProgress.map((p: LessonProgressItem) => p.lesson.module.course.id)
        )];

        // Get all lesson counts in one query
        const lessonCounts = await prisma.lesson.groupBy({
          by: ["moduleId"],
          where: {
            module: { courseId: { in: courseIds } },
            isPublished: true,
          },
          _count: { id: true },
        });

        // Get module to course mapping
        const modules = await prisma.module.findMany({
          where: { courseId: { in: courseIds } },
          select: { id: true, courseId: true },
        });

        type ModuleItem = (typeof modules)[number];
        const moduleToCoursemap = new Map<string, string>(
          modules.map((m: ModuleItem) => [m.id, m.courseId])
        );
        const courseLessonCounts = new Map<string, number>();
        for (const lc of lessonCounts) {
          const courseId = moduleToCoursemap.get(lc.moduleId);
          if (courseId) {
            courseLessonCounts.set(
              courseId,
              (courseLessonCounts.get(courseId) || 0) + lc._count.id
            );
          }
        }

        const courseProgress = new Map<
          string,
          { title: string; completed: number; total: number }
        >();

        for (const progress of user.lessonProgress) {
          const course = progress.lesson.module.course;
          if (!courseProgress.has(course.id)) {
            courseProgress.set(course.id, {
              title: course.title,
              completed: 0,
              total: courseLessonCounts.get(course.id) || 0,
            });
          }
          if (progress.completed) {
            const data = courseProgress.get(course.id)!;
            data.completed++;
          }
        }

        const coursesInProgress = Array.from(courseProgress.values())
          .filter((c) => c.completed > 0 && c.completed < c.total)
          .map((c) => ({
            title: c.title,
            progress: Math.round((c.completed / c.total) * 100),
          }))
          .slice(0, 3);

        // Determine next milestone
        let nextMilestone: string | undefined;
        if (streakDays >= 6 && streakDays < 7) {
          nextMilestone = "One more day for a full week streak!";
        } else if (streakDays >= 13 && streakDays < 14) {
          nextMilestone = "Almost at 2 weeks! Keep going!";
        } else if (streakDays >= 28 && streakDays < 30) {
          nextMilestone = "30-day streak is within reach!";
        } else if (coursesInProgress.some((c) => c.progress >= 80)) {
          const almostDone = coursesInProgress.find((c) => c.progress >= 80);
          nextMilestone = `Almost done with ${almostDone?.title}!`;
        }

        // Only send if there's activity or new courses
        if (lessonsWatched === 0 && newCourses.length === 0 && streakDays === 0) {
          continue;
        }

        const emailData = weeklyDigestEmail({
          firstName: user.firstName || "there",
          streakDays,
          lessonsWatched,
          totalWatchTime,
          coursesInProgress,
          newCourses: newCourses.map((c: { title: string; discipline: string }) => ({
            title: c.title,
            discipline: c.discipline,
          })),
          nextMilestone,
        });

        await sendEmail({
          to: user.email,
          subject: emailData.subject,
          html: emailData.html,
        });

        sentCount++;
      } catch (error) {
        console.error(`Failed to send digest to ${user.email}:`, error);
        errorCount++;
      }
    }

    return NextResponse.json({
      success: true,
      sent: sentCount,
      errors: errorCount,
      totalUsers: users.length,
    });
  } catch (error) {
    console.error("Weekly digest cron error:", error);
    return NextResponse.json(
      { error: "Failed to send weekly digests" },
      { status: 500 }
    );
  }
}

function formatWatchTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);
  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
}
