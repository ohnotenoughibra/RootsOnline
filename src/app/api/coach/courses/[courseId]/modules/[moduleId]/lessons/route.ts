import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ courseId: string; moduleId: string }> }
) {
  try {
    const { userId } = await auth();
    const { courseId, moduleId } = await params;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify course ownership
    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        coachId: user.id,
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Get module and lesson count
    const module = await prisma.module.findFirst({
      where: {
        id: moduleId,
        courseId,
      },
      include: {
        _count: {
          select: { lessons: true },
        },
      },
    });

    if (!module) {
      return NextResponse.json({ error: "Module not found" }, { status: 404 });
    }

    const body = await request.json();
    const { title, description, videoUrl, isFreePreview } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const lesson = await prisma.lesson.create({
      data: {
        title,
        description: description || null,
        videoUrl: videoUrl || null,
        isFreePreview: isFreePreview || false,
        isPublished: true,
        order: module._count.lessons,
        moduleId,
      },
    });

    return NextResponse.json({ lesson }, { status: 201 });
  } catch (error) {
    console.error("Error creating lesson:", error);
    return NextResponse.json(
      { error: "Failed to create lesson" },
      { status: 500 }
    );
  }
}
