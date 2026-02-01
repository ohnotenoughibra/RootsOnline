import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET - get all tags for a lesson
export async function GET(
  request: Request,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { lessonId } = await params;

    // Check if lesson exists
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: { id: true, title: true },
    });

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    const lessonTags = await prisma.lessonTag.findMany({
      where: { lessonId },
      include: {
        tag: {
          select: {
            id: true,
            name: true,
            slug: true,
            discipline: true,
            description: true,
          },
        },
      },
      orderBy: {
        tag: {
          name: "asc",
        },
      },
    });

    const tags = lessonTags.map((lt) => ({
      id: lt.tag.id,
      name: lt.tag.name,
      slug: lt.tag.slug,
      discipline: lt.tag.discipline,
      description: lt.tag.description,
      taggedAt: lt.createdAt,
    }));

    return NextResponse.json({ lesson, tags });
  } catch (error) {
    console.error("Error fetching lesson tags:", error);
    return NextResponse.json(
      { error: "Failed to fetch lesson tags" },
      { status: 500 }
    );
  }
}

// POST - add a tag to a lesson (admin/coach only)
export async function POST(
  request: Request,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { userId: clerkId } = await auth();
    const { lessonId } = await params;

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin or coach
    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.role !== "ADMIN" && user.role !== "COACH") {
      return NextResponse.json(
        { error: "Only admins and coaches can tag lessons" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { tagId, tagSlug } = body;

    // Either tagId or tagSlug must be provided
    if (!tagId && !tagSlug) {
      return NextResponse.json(
        { error: "Either tagId or tagSlug is required" },
        { status: 400 }
      );
    }

    // Check if lesson exists
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: {
            course: {
              select: { coachId: true },
            },
          },
        },
      },
    });

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    // For coaches (non-admin), verify they own the course
    if (user.role === "COACH" && lesson.module.course.coachId !== user.id) {
      return NextResponse.json(
        { error: "You can only tag lessons in your own courses" },
        { status: 403 }
      );
    }

    // Find the technique tag
    const tag = await prisma.techniqueTag.findFirst({
      where: tagId ? { id: tagId } : { slug: tagSlug! },
    });

    if (!tag) {
      return NextResponse.json(
        { error: "Technique tag not found" },
        { status: 404 }
      );
    }

    // Check if already tagged
    const existingTag = await prisma.lessonTag.findUnique({
      where: {
        lessonId_tagId: {
          lessonId,
          tagId: tag.id,
        },
      },
    });

    if (existingTag) {
      return NextResponse.json(
        { error: "This lesson is already tagged with this technique" },
        { status: 409 }
      );
    }

    // Create the lesson tag
    const lessonTag = await prisma.lessonTag.create({
      data: {
        lessonId,
        tagId: tag.id,
      },
      include: {
        tag: {
          select: {
            id: true,
            name: true,
            slug: true,
            discipline: true,
            description: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        tag: {
          id: lessonTag.tag.id,
          name: lessonTag.tag.name,
          slug: lessonTag.tag.slug,
          discipline: lessonTag.tag.discipline,
          description: lessonTag.tag.description,
          taggedAt: lessonTag.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding tag to lesson:", error);
    return NextResponse.json(
      { error: "Failed to add tag to lesson" },
      { status: 500 }
    );
  }
}

// DELETE - remove a tag from a lesson (admin/coach only)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { userId: clerkId } = await auth();
    const { lessonId } = await params;

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin or coach
    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.role !== "ADMIN" && user.role !== "COACH") {
      return NextResponse.json(
        { error: "Only admins and coaches can remove lesson tags" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const tagId = searchParams.get("tagId");
    const tagSlug = searchParams.get("tagSlug");

    // Either tagId or tagSlug must be provided
    if (!tagId && !tagSlug) {
      return NextResponse.json(
        { error: "Either tagId or tagSlug query parameter is required" },
        { status: 400 }
      );
    }

    // Check if lesson exists
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: {
            course: {
              select: { coachId: true },
            },
          },
        },
      },
    });

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    // For coaches (non-admin), verify they own the course
    if (user.role === "COACH" && lesson.module.course.coachId !== user.id) {
      return NextResponse.json(
        { error: "You can only manage tags on lessons in your own courses" },
        { status: 403 }
      );
    }

    // Find the technique tag
    const tag = await prisma.techniqueTag.findFirst({
      where: tagId ? { id: tagId } : { slug: tagSlug! },
    });

    if (!tag) {
      return NextResponse.json(
        { error: "Technique tag not found" },
        { status: 404 }
      );
    }

    // Find and delete the lesson tag
    const lessonTag = await prisma.lessonTag.findUnique({
      where: {
        lessonId_tagId: {
          lessonId,
          tagId: tag.id,
        },
      },
    });

    if (!lessonTag) {
      return NextResponse.json(
        { error: "This lesson is not tagged with this technique" },
        { status: 404 }
      );
    }

    await prisma.lessonTag.delete({
      where: { id: lessonTag.id },
    });

    return NextResponse.json({
      success: true,
      message: `Tag "${tag.name}" removed from lesson`,
    });
  } catch (error) {
    console.error("Error removing tag from lesson:", error);
    return NextResponse.json(
      { error: "Failed to remove tag from lesson" },
      { status: 500 }
    );
  }
}
