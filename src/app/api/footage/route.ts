import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// GET - List user's footage submissions
export async function GET() {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const footage = await prisma.trainingFootage.findMany({
      where: { memberId: user.id },
      include: {
        feedback: {
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
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ footage });
  } catch (error) {
    console.error("Error fetching footage:", error);
    return NextResponse.json(
      { error: "Failed to fetch footage" },
      { status: 500 }
    );
  }
}

// POST - Submit new training footage
export async function POST(request: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    const { title, description, videoUrl, videoPublicId, videoDuration, thumbnailUrl, discipline } = body;

    if (!title || !videoUrl || !discipline) {
      return NextResponse.json(
        { error: "Title, video URL, and discipline are required" },
        { status: 400 }
      );
    }

    const footage = await prisma.trainingFootage.create({
      data: {
        title,
        description,
        videoUrl,
        videoPublicId,
        videoDuration,
        thumbnailUrl,
        discipline,
        memberId: user.id,
        status: "PENDING",
      },
    });

    return NextResponse.json({ footage });
  } catch (error) {
    console.error("Error creating footage:", error);
    return NextResponse.json(
      { error: "Failed to create footage submission" },
      { status: 500 }
    );
  }
}
