import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{
    quizId: string;
  }>;
}

// GET quiz with questions
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { userId: clerkId } = await auth();
    const { quizId } = await params;

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          include: {
            options: {
              select: {
                id: true,
                text: true,
                // Don't expose isCorrect until after submission
              },
            },
          },
          orderBy: { order: "asc" },
        },
        lesson: {
          select: {
            title: true,
            module: {
              select: {
                title: true,
                course: {
                  select: {
                    title: true,
                    slug: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    // Get user's best attempt
    const bestAttempt = await prisma.quizAttempt.findFirst({
      where: { quizId, userId: user.id },
      orderBy: { score: "desc" },
    });

    return NextResponse.json({
      ...quiz,
      bestScore: bestAttempt?.score,
      hasPassed: bestAttempt?.passed,
    });
  } catch (error) {
    console.error("Error fetching quiz:", error);
    return NextResponse.json(
      { error: "Failed to fetch quiz" },
      { status: 500 }
    );
  }
}

// POST submit quiz answers
export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { userId: clerkId } = await auth();
    const { quizId } = await params;

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { answers } = await request.json();

    if (!answers || typeof answers !== "object") {
      return NextResponse.json(
        { error: "Answers required" },
        { status: 400 }
      );
    }

    // Get quiz with correct answers
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    // Calculate score
    let correctCount = 0;
    const totalQuestions = quiz.questions.length;

    const results: Record<string, { correct: boolean; correctOptionId: string; explanation?: string }> = {};

    for (const question of quiz.questions) {
      const userAnswer = answers[question.id];
      const correctOption = question.options.find((o) => o.isCorrect);

      if (correctOption) {
        const isCorrect = userAnswer === correctOption.id;
        if (isCorrect) correctCount++;

        results[question.id] = {
          correct: isCorrect,
          correctOptionId: correctOption.id,
          explanation: correctOption.explanation || undefined,
        };
      }
    }

    const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const passed = score >= quiz.passingScore;

    // Save attempt
    const attempt = await prisma.quizAttempt.create({
      data: {
        quizId,
        userId: user.id,
        score,
        passed,
        answers: JSON.stringify(answers),
      },
    });

    return NextResponse.json({
      attempt,
      score,
      passed,
      correctCount,
      totalQuestions,
      results,
      passingScore: quiz.passingScore,
    });
  } catch (error) {
    console.error("Error submitting quiz:", error);
    return NextResponse.json(
      { error: "Failed to submit quiz" },
      { status: 500 }
    );
  }
}
