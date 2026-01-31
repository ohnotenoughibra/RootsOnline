import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

// GET current user's streak
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

    let streak = await prisma.trainingStreak.findUnique({
      where: { userId: user.id },
    });

    // Create streak record if doesn't exist
    if (!streak) {
      streak = await prisma.trainingStreak.create({
        data: {
          userId: user.id,
          currentStreak: 0,
          longestStreak: 0,
        },
      });
    }

    // Check if streak is still valid (last activity within 48 hours)
    const now = new Date();
    const lastActive = new Date(streak.lastActiveAt);
    const hoursSinceActive = (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60);

    // If more than 48 hours since last activity, reset streak
    if (hoursSinceActive > 48 && streak.currentStreak > 0) {
      streak = await prisma.trainingStreak.update({
        where: { userId: user.id },
        data: { currentStreak: 0 },
      });
    }

    return NextResponse.json({
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
      lastActiveAt: streak.lastActiveAt,
    });
  } catch (error) {
    console.error("Error fetching streak:", error);
    return NextResponse.json(
      { error: "Failed to fetch streak" },
      { status: 500 }
    );
  }
}

// POST - record training activity (updates streak)
export async function POST() {
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

    let streak = await prisma.trainingStreak.findUnique({
      where: { userId: user.id },
    });

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (!streak) {
      // Create new streak
      streak = await prisma.trainingStreak.create({
        data: {
          userId: user.id,
          currentStreak: 1,
          longestStreak: 1,
          lastActiveAt: now,
        },
      });
    } else {
      const lastActive = new Date(streak.lastActiveAt);
      const lastActiveDay = new Date(
        lastActive.getFullYear(),
        lastActive.getMonth(),
        lastActive.getDate()
      );

      // Calculate days since last activity
      const daysSinceActive = Math.floor(
        (today.getTime() - lastActiveDay.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysSinceActive === 0) {
        // Already trained today, just update timestamp
        streak = await prisma.trainingStreak.update({
          where: { userId: user.id },
          data: { lastActiveAt: now },
        });
      } else if (daysSinceActive === 1) {
        // Consecutive day, increment streak
        const newStreak = streak.currentStreak + 1;
        streak = await prisma.trainingStreak.update({
          where: { userId: user.id },
          data: {
            currentStreak: newStreak,
            longestStreak: Math.max(newStreak, streak.longestStreak),
            lastActiveAt: now,
          },
        });
      } else {
        // Streak broken, start fresh
        streak = await prisma.trainingStreak.update({
          where: { userId: user.id },
          data: {
            currentStreak: 1,
            lastActiveAt: now,
          },
        });
      }
    }

    return NextResponse.json({
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
      lastActiveAt: streak.lastActiveAt,
    });
  } catch (error) {
    console.error("Error updating streak:", error);
    return NextResponse.json(
      { error: "Failed to update streak" },
      { status: 500 }
    );
  }
}
