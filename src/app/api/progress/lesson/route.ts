import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET - get progress for a specific lesson
export async function GET(request: Request) {
  try {
    const { userId: clerkId } = await auth();
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get("lessonId");

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!lessonId) {
      return NextResponse.json(
        { error: "Lesson ID is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const progress = await prisma.lessonProgress.findUnique({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId,
        },
      },
    });

    if (!progress) {
      return NextResponse.json({
        watchedSeconds: 0,
        completed: false,
      });
    }

    return NextResponse.json({
      watchedSeconds: progress.watchedSeconds,
      completed: progress.completed,
      completedAt: progress.completedAt,
    });
  } catch (error) {
    console.error("Error fetching lesson progress:", error);
    return NextResponse.json(
      { error: "Failed to fetch progress" },
      { status: 500 }
    );
  }
}
