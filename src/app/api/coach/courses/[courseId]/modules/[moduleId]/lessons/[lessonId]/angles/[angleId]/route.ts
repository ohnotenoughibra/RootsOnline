import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

// Update a video angle
export async function PATCH(
  request: Request,
  {
    params,
  }: { params: Promise<{ courseId: string; moduleId: string; lessonId: string; angleId: string }> }
) {
  try {
    const { userId } = await auth();
    const { courseId, lessonId, angleId } = await params;

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
    const { angleLabel, videoUrl, videoPublicId, videoDuration, isDefault, order } = body;

    // If setting as default, unset other defaults
    if (isDefault) {
      await prisma.videoAngle.updateMany({
        where: { lessonId, id: { not: angleId } },
        data: { isDefault: false },
      });
    }

    const updateData: Record<string, unknown> = {};
    if (angleLabel !== undefined) updateData.angleLabel = angleLabel;
    if (videoUrl !== undefined) updateData.videoUrl = videoUrl;
    if (videoPublicId !== undefined) updateData.videoPublicId = videoPublicId;
    if (videoDuration !== undefined) updateData.videoDuration = videoDuration;
    if (isDefault !== undefined) updateData.isDefault = isDefault;
    if (order !== undefined) updateData.order = order;

    const angle = await prisma.videoAngle.update({
      where: { id: angleId },
      data: updateData,
    });

    return NextResponse.json({ angle });
  } catch (error) {
    console.error("Error updating video angle:", error);
    return NextResponse.json(
      { error: "Failed to update video angle" },
      { status: 500 }
    );
  }
}

// Delete a video angle
export async function DELETE(
  request: Request,
  {
    params,
  }: { params: Promise<{ courseId: string; moduleId: string; lessonId: string; angleId: string }> }
) {
  try {
    const { userId } = await auth();
    const { courseId, angleId } = await params;

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

    await prisma.videoAngle.delete({
      where: { id: angleId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting video angle:", error);
    return NextResponse.json(
      { error: "Failed to delete video angle" },
      { status: 500 }
    );
  }
}
