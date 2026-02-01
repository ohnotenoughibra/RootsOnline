import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

// Get a specific quiz
export async function GET(
  request: Request,
  {
    params,
  }: { params: Promise<{ courseId: string; moduleId: string; lessonId: string; quizId: string }> }
) {
  try {
    const { userId } = await auth();
    const { courseId, quizId } = await params;

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

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
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
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    return NextResponse.json({ quiz });
  } catch (error) {
    console.error("Error fetching quiz:", error);
    return NextResponse.json(
      { error: "Failed to fetch quiz" },
      { status: 500 }
    );
  }
}

// Update a quiz
export async function PATCH(
  request: Request,
  {
    params,
  }: { params: Promise<{ courseId: string; moduleId: string; lessonId: string; quizId: string }> }
) {
  try {
    const { userId } = await auth();
    const { courseId, quizId } = await params;

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

    // Update basic quiz info
    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (passingScore !== undefined) updateData.passingScore = passingScore;

    // If questions are provided, replace all questions
    if (questions !== undefined) {
      // Delete existing questions (cascade deletes options)
      await prisma.quizQuestion.deleteMany({
        where: { quizId },
      });

      // Create new questions
      if (questions.length > 0) {
        for (let i = 0; i < questions.length; i++) {
          const q = questions[i];
          await prisma.quizQuestion.create({
            data: {
              quizId,
              question: q.question,
              imageUrl: q.imageUrl || null,
              order: q.order ?? i,
              options: {
                create: q.options?.map((opt: { text: string; isCorrect: boolean; explanation?: string }) => ({
                  text: opt.text,
                  isCorrect: opt.isCorrect || false,
                  explanation: opt.explanation || null,
                })) || [],
              },
            },
          });
        }
      }
    }

    const quiz = await prisma.quiz.update({
      where: { id: quizId },
      data: updateData,
      include: {
        questions: {
          orderBy: { order: "asc" },
          include: {
            options: true,
          },
        },
      },
    });

    return NextResponse.json({ quiz });
  } catch (error) {
    console.error("Error updating quiz:", error);
    return NextResponse.json(
      { error: "Failed to update quiz" },
      { status: 500 }
    );
  }
}

// Delete a quiz
export async function DELETE(
  request: Request,
  {
    params,
  }: { params: Promise<{ courseId: string; moduleId: string; lessonId: string; quizId: string }> }
) {
  try {
    const { userId } = await auth();
    const { courseId, quizId } = await params;

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

    await prisma.quiz.delete({
      where: { id: quizId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting quiz:", error);
    return NextResponse.json(
      { error: "Failed to delete quiz" },
      { status: 500 }
    );
  }
}
