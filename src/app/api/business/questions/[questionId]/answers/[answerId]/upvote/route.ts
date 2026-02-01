import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// POST - Upvote answer
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

    // Get answer
    const answer = await prisma.businessAnswer.findUnique({
      where: { id: answerId, questionId },
    });

    if (!answer) {
      return NextResponse.json({ error: "Answer not found" }, { status: 404 });
    }

    // Increment upvotes
    // Note: For a production app, you'd want to track who upvoted to prevent duplicates
    const updatedAnswer = await prisma.businessAnswer.update({
      where: { id: answerId },
      data: { upvotes: { increment: 1 } },
    });

    return NextResponse.json({ upvotes: updatedAnswer.upvotes });
  } catch (error) {
    console.error("Error upvoting answer:", error);
    return NextResponse.json(
      { error: "Failed to upvote answer" },
      { status: 500 }
    );
  }
}
