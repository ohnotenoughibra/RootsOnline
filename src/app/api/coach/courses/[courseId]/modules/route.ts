import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { userId } = await auth();
    const { courseId } = await params;

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
      include: {
        _count: {
          select: { modules: true },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const body = await request.json();
    const { title, description } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    // Create module with next order
    const module = await prisma.module.create({
      data: {
        title,
        description: description || null,
        order: course._count.modules,
        courseId,
      },
    });

    return NextResponse.json({ module }, { status: 201 });
  } catch (error) {
    console.error("Error creating module:", error);
    return NextResponse.json(
      { error: "Failed to create module" },
      { status: 500 }
    );
  }
}
