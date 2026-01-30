import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser, isCoach } from "@/lib/auth";

// POST - Add feedback to footage (coaches only)
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = auth();
    const { id: footageId } = await params;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getCurrentUser();
    const canReview = await isCoach();

    if (!user || !canReview) {
      return NextResponse.json(
        { error: "Only coaches can provide feedback" },
        { status: 403 }
      );
    }

    // Check footage exists
    const footage = await prisma.trainingFootage.findUnique({
      where: { id: footageId },
    });

    if (!footage) {
      return NextResponse.json({ error: "Footage not found" }, { status: 404 });
    }

    const body = await request.json();
    const { content, videoUrl, videoPublicId, timestamps, rating } = body;

    if (!content) {
      return NextResponse.json(
        { error: "Feedback content is required" },
        { status: 400 }
      );
    }

    // Create feedback
    const feedback = await prisma.videoFeedback.create({
      data: {
        footageId,
        coachId: user.id,
        content,
        videoUrl,
        videoPublicId,
        timestamps: timestamps ? JSON.stringify(timestamps) : null,
        rating,
      },
      include: {
        coach: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            imageUrl: true,
          },
        },
      },
    });

    // Update footage status to REVIEWED
    await prisma.trainingFootage.update({
      where: { id: footageId },
      data: { status: "REVIEWED" },
    });

    return NextResponse.json({ feedback });
  } catch (error) {
    console.error("Error creating feedback:", error);
    return NextResponse.json(
      { error: "Failed to create feedback" },
      { status: 500 }
    );
  }
}
