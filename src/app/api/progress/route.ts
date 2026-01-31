import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

// POST - update lesson progress
export async function POST(request: Request) {
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

    const { lessonId, watchedSeconds, completed } = await request.json();

    if (!lessonId) {
      return NextResponse.json(
        { error: "Lesson ID is required" },
        { status: 400 }
      );
    }

    // Upsert progress
    const progress = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId,
        },
      },
      update: {
        watchedSeconds: watchedSeconds ?? undefined,
        completed: completed ?? undefined,
        completedAt: completed ? new Date() : undefined,
      },
      create: {
        userId: user.id,
        lessonId,
        watchedSeconds: watchedSeconds ?? 0,
        completed: completed ?? false,
        completedAt: completed ? new Date() : null,
      },
    });

    // Update training streak if lesson completed
    if (completed) {
      // Trigger streak update
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ""}/api/streaks`, {
        method: "POST",
        headers: {
          Cookie: request.headers.get("cookie") || "",
        },
      }).catch(() => {
        // Silently fail - streak update is not critical
      });
    }

    return NextResponse.json(progress);
  } catch (error) {
    console.error("Error updating progress:", error);
    return NextResponse.json(
      { error: "Failed to update progress" },
      { status: 500 }
    );
  }
}

// GET - get progress for a course
export async function GET(request: Request) {
  try {
    const { userId: clerkId } = await auth();
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!courseId) {
      // Return all progress
      const allProgress = await prisma.lessonProgress.findMany({
        where: { userId: user.id },
      });
      return NextResponse.json(allProgress);
    }

    // Get all lessons for the course
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        modules: {
          include: {
            lessons: {
              where: { isPublished: true },
              select: { id: true },
            },
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const lessonIds = course.modules.flatMap((m) => m.lessons.map((l) => l.id));

    const progress = await prisma.lessonProgress.findMany({
      where: {
        userId: user.id,
        lessonId: { in: lessonIds },
      },
    });

    const completedCount = progress.filter((p) => p.completed).length;

    return NextResponse.json({
      lessons: progress,
      totalLessons: lessonIds.length,
      completedLessons: completedCount,
      percentComplete: lessonIds.length > 0
        ? Math.round((completedCount / lessonIds.length) * 100)
        : 0,
    });
  } catch (error) {
    console.error("Error fetching progress:", error);
    return NextResponse.json(
      { error: "Failed to fetch progress" },
      { status: 500 }
    );
  }
}
