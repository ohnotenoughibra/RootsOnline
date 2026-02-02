import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// POST - Accept answer
export async function POST(
  request: Request,
  { params }: { params: Promise<{ questionId: string; answerId: string }> }
) {
  try {
    const { userId } = await auth();
    const { questionId, answerId } = await params;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get question
    const question = await prisma.businessQuestion.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    // Only question owner or admin can accept
    if (question.userId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Not authorized to accept answers" },
        { status: 403 }
      );
    }

    // Get answer
    const answer = await prisma.businessAnswer.findUnique({
      where: { id: answerId, questionId },
    });

    if (!answer) {
      return NextResponse.json({ error: "Answer not found" }, { status: 404 });
    }

    // Unaccept any previously accepted answer and accept this one
    await prisma.$transaction([
      prisma.businessAnswer.updateMany({
        where: { questionId, isAccepted: true },
        data: { isAccepted: false },
      }),
      prisma.businessAnswer.update({
        where: { id: answerId },
        data: { isAccepted: true },
      }),
      prisma.businessQuestion.update({
        where: { id: questionId },
        data: { isAnswered: true },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error accepting answer:", error);
    return NextResponse.json(
      { error: "Failed to accept answer" },
      { status: 500 }
    );
  }
}
