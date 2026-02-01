import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

// Get discussions for a course or lesson
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");
    const lessonId = searchParams.get("lessonId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const where: Record<string, unknown> = {};
    if (courseId) where.courseId = courseId;
    if (lessonId) where.lessonId = lessonId;

    const [discussions, total] = await Promise.all([
      prisma.discussion.findMany({
        where,
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
          _count: {
            select: { replies: true },
          },
        },
        orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.discussion.count({ where }),
    ]);

    return NextResponse.json({
      discussions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching discussions:", error);
    return NextResponse.json(
      { error: "Failed to fetch discussions" },
      { status: 500 }
    );
  }
}

// Create a new discussion
export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check subscription for creating discussions
    const hasAccess =
      user.role === "ADMIN" ||
      user.role === "COACH" ||
      user.subscriptionStatus === "ACTIVE" ||
      user.subscriptionStatus === "TRIALING";

    if (!hasAccess) {
      return NextResponse.json(
        { error: "Subscription required to start discussions" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, content, courseId, lessonId } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const discussion = await prisma.discussion.create({
      data: {
        title,
        content,
        authorId: user.id,
        courseId: courseId || null,
        lessonId: lessonId || null,
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
        _count: {
          select: { replies: true },
        },
      },
    });

    return NextResponse.json({ discussion }, { status: 201 });
  } catch (error) {
    console.error("Error creating discussion:", error);
    return NextResponse.json(
      { error: "Failed to create discussion" },
      { status: 500 }
    );
  }
}
