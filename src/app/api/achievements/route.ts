import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

// GET - get user's achievements
export async function GET() {
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

    // Get all achievements with user's earned status
    const allAchievements = await prisma.achievement.findMany({
      orderBy: [{ category: "asc" }, { points: "desc" }],
    });

    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId: user.id },
      include: { achievement: true },
    });

    const earnedIds = new Set(userAchievements.map((ua) => ua.achievementId));

    const achievements = allAchievements.map((a) => ({
      ...a,
      earned: earnedIds.has(a.id),
      earnedAt: userAchievements.find((ua) => ua.achievementId === a.id)?.earnedAt,
    }));

    const totalPoints = userAchievements.reduce(
      (acc, ua) => acc + ua.achievement.points,
      0
    );

    return NextResponse.json({
      achievements,
      earnedCount: userAchievements.length,
      totalCount: allAchievements.length,
      totalPoints,
    });
  } catch (error) {
    console.error("Error fetching achievements:", error);
    return NextResponse.json(
      { error: "Failed to fetch achievements" },
      { status: 500 }
    );
  }
}

// POST - check and award achievements (called internally)
export async function POST(request: Request) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: {
        streaks: true,
        lessonProgress: { where: { completed: true } },
        certificates: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const newlyEarned: string[] = [];

    // Check streak achievements
    const streak = user.streaks[0];
    if (streak) {
      const streakAchievements = await prisma.achievement.findMany({
        where: { category: "STREAK" },
      });

      for (const achievement of streakAchievements) {
        if (streak.currentStreak >= achievement.requirement) {
          const exists = await prisma.userAchievement.findUnique({
            where: {
              userId_achievementId: {
                userId: user.id,
                achievementId: achievement.id,
              },
            },
          });

          if (!exists) {
            await prisma.userAchievement.create({
              data: {
                userId: user.id,
                achievementId: achievement.id,
              },
            });
            newlyEarned.push(achievement.name);
          }
        }
      }
    }

    // Check progress achievements
    const completedLessons = user.lessonProgress.length;
    const progressAchievements = await prisma.achievement.findMany({
      where: { category: "PROGRESS" },
    });

    for (const achievement of progressAchievements) {
      if (completedLessons >= achievement.requirement) {
        const exists = await prisma.userAchievement.findUnique({
          where: {
            userId_achievementId: {
              userId: user.id,
              achievementId: achievement.id,
            },
          },
        });

        if (!exists) {
          await prisma.userAchievement.create({
            data: {
              userId: user.id,
              achievementId: achievement.id,
            },
          });
          newlyEarned.push(achievement.name);
        }
      }
    }

    // Check certificate achievements
    const certificateCount = user.certificates.length;
    const certAchievements = await prisma.achievement.findMany({
      where: { category: "CERTIFICATE" },
    });

    for (const achievement of certAchievements) {
      if (certificateCount >= achievement.requirement) {
        const exists = await prisma.userAchievement.findUnique({
          where: {
            userId_achievementId: {
              userId: user.id,
              achievementId: achievement.id,
            },
          },
        });

        if (!exists) {
          await prisma.userAchievement.create({
            data: {
              userId: user.id,
              achievementId: achievement.id,
            },
          });
          newlyEarned.push(achievement.name);
        }
      }
    }

    return NextResponse.json({
      newlyEarned,
      message:
        newlyEarned.length > 0
          ? `Earned ${newlyEarned.length} new achievement(s)!`
          : "No new achievements",
    });
  } catch (error) {
    console.error("Error checking achievements:", error);
    return NextResponse.json(
      { error: "Failed to check achievements" },
      { status: 500 }
    );
  }
}
