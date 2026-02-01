import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

// Get video angles for a lesson
export async function GET(
  request: Request,
  {
    params,
  }: { params: Promise<{ courseId: string; moduleId: string; lessonId: string }> }
) {
  try {
    const { userId } = await auth();
    const { courseId, lessonId } = await params;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isAdmin = user.role === "ADMIN";

    // Verify course ownership (admins can access any course)
    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        ...(isAdmin ? {} : { coachId: user.id }),
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const angles = await prisma.videoAngle.findMany({
      where: { lessonId },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ angles });
  } catch (error) {
    console.error("Error fetching video angles:", error);
    return NextResponse.json(
      { error: "Failed to fetch video angles" },
      { status: 500 }
    );
  }
}

// Add a video angle
export async function POST(
  request: Request,
  {
    params,
  }: { params: Promise<{ courseId: string; moduleId: string; lessonId: string }> }
) {
  try {
    const { userId } = await auth();
    const { courseId, lessonId } = await params;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isAdmin = user.role === "ADMIN";

    // Verify course ownership
    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        ...(isAdmin ? {} : { coachId: user.id }),
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const body = await request.json();
    const { angleLabel, videoUrl, videoPublicId, videoDuration, isDefault } = body;

    if (!angleLabel || !videoUrl) {
      return NextResponse.json(
        { error: "Angle label and video URL are required" },
        { status: 400 }
      );
    }

    // Get current count for order
    const count = await prisma.videoAngle.count({ where: { lessonId } });

    // If setting as default, unset other defaults
    if (isDefault) {
      await prisma.videoAngle.updateMany({
        where: { lessonId },
        data: { isDefault: false },
      });
    }

    const angle = await prisma.videoAngle.create({
      data: {
        lessonId,
        angleLabel,
        videoUrl,
        videoPublicId: videoPublicId || null,
        videoDuration: videoDuration || null,
        order: count,
        isDefault: isDefault || count === 0, // First angle is default
      },
    });

    return NextResponse.json({ angle }, { status: 201 });
  } catch (error) {
    console.error("Error creating video angle:", error);
    return NextResponse.json(
      { error: "Failed to create video angle" },
      { status: 500 }
    );
  }
}
