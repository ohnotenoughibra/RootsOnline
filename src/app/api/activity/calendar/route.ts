import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET - get user's activity for the last year (for calendar heatmap)
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

    // Get date 1 year ago
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    oneYearAgo.setHours(0, 0, 0, 0);

    // Get all completed lessons in the last year
    const progress = await prisma.lessonProgress.findMany({
      where: {
        userId: user.id,
        completed: true,
        completedAt: {
          gte: oneYearAgo,
        },
      },
      select: {
        completedAt: true,
      },
    });

    // Group by date
    const activityMap = new Map<string, number>();

    for (const p of progress) {
      if (p.completedAt) {
        const dateStr = p.completedAt.toISOString().split("T")[0];
        activityMap.set(dateStr, (activityMap.get(dateStr) || 0) + 1);
      }
    }

    // Convert to array
    const activity = Array.from(activityMap.entries()).map(([date, count]) => ({
      date,
      count,
    }));

    return NextResponse.json({ activity });
  } catch (error) {
    console.error("Error fetching activity:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity" },
      { status: 500 }
    );
  }
}
