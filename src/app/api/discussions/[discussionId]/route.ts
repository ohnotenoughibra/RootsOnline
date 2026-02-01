import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

// Get a discussion with replies
export async function GET(
  request: Request,
  { params }: { params: Promise<{ discussionId: string }> }
) {
  try {
    const { discussionId } = await params;

    const discussion = await prisma.discussion.findUnique({
      where: { id: discussionId },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            imageUrl: true,
            role: true,
          },
        },
        replies: {
          where: { parentId: null }, // Top-level replies only
          include: {
            author: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                imageUrl: true,
                role: true,
              },
            },
            children: {
              include: {
                author: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    imageUrl: true,
                    role: true,
                  },
                },
              },
              orderBy: { createdAt: "asc" },
            },
          },
          orderBy: [{ isCoachAnswer: "desc" }, { createdAt: "asc" }],
        },
      },
    });

    if (!discussion) {
      return NextResponse.json(
        { error: "Discussion not found" },
        { status: 404 }
      );
    }

    // Increment view count
    await prisma.discussion.update({
      where: { id: discussionId },
      data: { viewCount: { increment: 1 } },
    });

    return NextResponse.json({ discussion });
  } catch (error) {
    console.error("Error fetching discussion:", error);
    return NextResponse.json(
      { error: "Failed to fetch discussion" },
      { status: 500 }
    );
  }
}

// Update discussion (author or admin only)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ discussionId: string }> }
) {
  try {
    const { userId } = await auth();
    const { discussionId } = await params;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const discussion = await prisma.discussion.findUnique({
      where: { id: discussionId },
    });

    if (!discussion) {
      return NextResponse.json(
        { error: "Discussion not found" },
        { status: 404 }
      );
    }

    const isOwner = discussion.authorId === user.id;
    const isAdmin = user.role === "ADMIN";

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { title, content, isPinned, isLocked } = body;

    const updateData: Record<string, unknown> = {};
    if (title !== undefined && isOwner) updateData.title = title;
    if (content !== undefined && isOwner) updateData.content = content;
    if (isPinned !== undefined && isAdmin) updateData.isPinned = isPinned;
    if (isLocked !== undefined && isAdmin) updateData.isLocked = isLocked;

    const updated = await prisma.discussion.update({
      where: { id: discussionId },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            imageUrl: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json({ discussion: updated });
  } catch (error) {
    console.error("Error updating discussion:", error);
    return NextResponse.json(
      { error: "Failed to update discussion" },
      { status: 500 }
    );
  }
}

// Delete discussion (author or admin only)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ discussionId: string }> }
) {
  try {
    const { userId } = await auth();
    const { discussionId } = await params;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const discussion = await prisma.discussion.findUnique({
      where: { id: discussionId },
    });

    if (!discussion) {
      return NextResponse.json(
        { error: "Discussion not found" },
        { status: 404 }
      );
    }

    const isOwner = discussion.authorId === user.id;
    const isAdmin = user.role === "ADMIN";

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.discussion.delete({
      where: { id: discussionId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting discussion:", error);
    return NextResponse.json(
      { error: "Failed to delete discussion" },
      { status: 500 }
    );
  }
}
