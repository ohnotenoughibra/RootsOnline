import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

// GET bookmarks for a lesson
export async function GET(
  request: Request,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { userId: clerkId } = await auth();
    const { lessonId } = await params;

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get all bookmarks for this lesson (including timestamp bookmarks)
    const bookmarks = await prisma.bookmark.findMany({
      where: {
        userId: user.id,
        lessonId,
      },
      orderBy: [
        { timestamp: { sort: "asc", nulls: "first" } },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json({
      bookmarked: bookmarks.length > 0,
      bookmarks,
    });
  } catch (error) {
    console.error("Error checking bookmark:", error);
    return NextResponse.json(
      { error: "Failed to check bookmark" },
      { status: 500 }
    );
  }
}

// DELETE - remove all bookmarks for a lesson (or specific bookmark by ID)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { userId: clerkId } = await auth();
    const { lessonId } = await params;
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

    if (bookmarkId) {
      // Delete specific bookmark by ID
      await prisma.bookmark.deleteMany({
        where: {
          id: bookmarkId,
          userId: user.id,
          lessonId,
        },
      });
    } else {
      // Delete all bookmarks for this lesson
      await prisma.bookmark.deleteMany({
        where: {
          userId: user.id,
          lessonId,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing bookmark:", error);
    return NextResponse.json(
      { error: "Failed to remove bookmark" },
      { status: 500 }
    );
  }
}
