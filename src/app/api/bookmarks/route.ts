import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

// GET all bookmarks for current user (or specific lesson)
export async function GET(request: Request) {
  try {
    const { userId: clerkId } = await auth();
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get("lessonId");

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const where = lessonId
      ? { userId: user.id, lessonId }
      : { userId: user.id };

    const bookmarks = await prisma.bookmark.findMany({
      where,
      include: {
        lesson: {
          include: {
            module: {
              include: {
                course: {
                  select: {
                    id: true,
                    title: true,
                    slug: true,
                    coverImage: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: lessonId
        ? [{ timestamp: { sort: "asc", nulls: "first" } }, { createdAt: "desc" }]
        : { createdAt: "desc" },
    });

    return NextResponse.json(bookmarks);
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookmarks" },
      { status: 500 }
    );
  }
}

// POST - add a bookmark (with optional timestamp)
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

    const { lessonId, timestamp, label } = await request.json();

    if (!lessonId) {
      return NextResponse.json(
        { error: "Lesson ID is required" },
        { status: 400 }
      );
    }

    // Check if lesson exists
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    // Create bookmark (multiple timestamps allowed per lesson)
    const bookmark = await prisma.bookmark.create({
      data: {
        userId: user.id,
        lessonId,
        timestamp: timestamp ?? null,
        label: label ?? null,
      },
    });

    return NextResponse.json(bookmark, { status: 201 });
  } catch (error) {
    console.error("Error creating bookmark:", error);
    return NextResponse.json(
      { error: "Failed to create bookmark" },
      { status: 500 }
    );
  }
}

// DELETE - remove a bookmark
export async function DELETE(request: Request) {
  try {
    const { userId: clerkId } = await auth();
    const { searchParams } = new URL(request.url);
    const bookmarkId = searchParams.get("id");

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!bookmarkId) {
      return NextResponse.json(
        { error: "Bookmark ID is required" },
        { status: 400 }
      );
    }

    // Verify ownership and delete
    const bookmark = await prisma.bookmark.findFirst({
      where: { id: bookmarkId, userId: user.id },
    });

    if (!bookmark) {
      return NextResponse.json(
        { error: "Bookmark not found" },
        { status: 404 }
      );
    }

    await prisma.bookmark.delete({
      where: { id: bookmarkId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting bookmark:", error);
    return NextResponse.json(
      { error: "Failed to delete bookmark" },
      { status: 500 }
    );
  }
}
