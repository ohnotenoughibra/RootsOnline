import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

// Get quizzes for a lesson
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

    const quizzes = await prisma.quiz.findMany({
      where: { lessonId },
      include: {
        questions: {
          orderBy: { order: "asc" },
          include: {
            options: true,
          },
        },
        _count: {
          select: { attempts: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ quizzes });
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return NextResponse.json(
      { error: "Failed to fetch quizzes" },
      { status: 500 }
    );
  }
}

// Create a new quiz for a lesson
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

    const body = await request.json();
    const { title, description, passingScore, questions } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    // Create quiz with questions and options
    const quiz = await prisma.quiz.create({
      data: {
        lessonId,
        title,
        description: description || null,
        passingScore: passingScore || 70,
        questions: {
          create: questions?.map((q: {
            question: string;
            imageUrl?: string;
            order: number;
            options: { text: string; isCorrect: boolean; explanation?: string }[];
          }, index: number) => ({
            question: q.question,
            imageUrl: q.imageUrl || null,
            order: q.order ?? index,
            options: {
              create: q.options?.map((opt: { text: string; isCorrect: boolean; explanation?: string }) => ({
                text: opt.text,
                isCorrect: opt.isCorrect || false,
                explanation: opt.explanation || null,
              })),
            },
          })) || [],
        },
      },
      include: {
        questions: {
          orderBy: { order: "asc" },
          include: {
            options: true,
          },
        },
      },
    });

    return NextResponse.json({ quiz }, { status: 201 });
  } catch (error) {
    console.error("Error creating quiz:", error);
    return NextResponse.json(
      { error: "Failed to create quiz" },
      { status: 500 }
    );
  }
}
