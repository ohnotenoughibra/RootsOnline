import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

// Add a reply to a discussion
export async function POST(
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

    // Check subscription for replies
    const hasAccess =
      user.role === "ADMIN" ||
      user.role === "COACH" ||
      user.subscriptionStatus === "ACTIVE" ||
      user.subscriptionStatus === "TRIALING";

    if (!hasAccess) {
      return NextResponse.json(
        { error: "Subscription required to reply" },
        { status: 403 }
      );
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

    if (discussion.isLocked) {
      return NextResponse.json(
        { error: "Discussion is locked" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { content, parentId } = body;

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    // If replying to another reply, verify it exists
    if (parentId) {
      const parentReply = await prisma.discussionReply.findFirst({
        where: { id: parentId, discussionId },
      });

      if (!parentReply) {
        return NextResponse.json(
          { error: "Parent reply not found" },
          { status: 404 }
        );
      }
    }

    const reply = await prisma.discussionReply.create({
      data: {
        content,
        authorId: user.id,
        discussionId,
        parentId: parentId || null,
      },
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

    return NextResponse.json({ reply }, { status: 201 });
  } catch (error) {
    console.error("Error creating reply:", error);
    return NextResponse.json(
      { error: "Failed to create reply" },
      { status: 500 }
    );
  }
}
