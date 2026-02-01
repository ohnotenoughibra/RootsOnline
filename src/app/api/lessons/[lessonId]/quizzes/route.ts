import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

// Get quizzes for a lesson (student view)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { userId } = await auth();
    const { lessonId } = await params;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check subscription/access
    const hasAccess =
      user.role === "ADMIN" ||
      user.role === "COACH" ||
      user.subscriptionStatus === "ACTIVE" ||
      user.subscriptionStatus === "TRIALING";

    if (!hasAccess) {
      return NextResponse.json(
        { error: "Subscription required" },
        { status: 403 }
      );
    }

    const quizzes = await prisma.quiz.findMany({
      where: { lessonId },
      select: {
        id: true,
        title: true,
        description: true,
        passingScore: true,
        _count: {
          select: { questions: true },
        },
      },
    });

    // Get user's best attempt for each quiz
    const quizzesWithAttempts = await Promise.all(
      quizzes.map(async (quiz) => {
        const bestAttempt = await prisma.quizAttempt.findFirst({
          where: { quizId: quiz.id, userId: user.id },
          orderBy: { score: "desc" },
        });

        return {
          ...quiz,
          questionCount: quiz._count.questions,
          bestScore: bestAttempt?.score,
          hasPassed: bestAttempt?.passed,
        };
      })
    );

    return NextResponse.json({ quizzes: quizzesWithAttempts });
  } catch (error) {
    console.error("Error fetching lesson quizzes:", error);
    return NextResponse.json(
      { error: "Failed to fetch quizzes" },
      { status: 500 }
    );
  }
}
