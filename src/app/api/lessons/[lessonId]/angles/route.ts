import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

// Get video angles for a lesson (student view)
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

    const angles = await prisma.videoAngle.findMany({
      where: { lessonId },
      orderBy: { order: "asc" },
      select: {
        id: true,
        angleLabel: true,
        videoUrl: true,
        videoDuration: true,
        isDefault: true,
        order: true,
      },
    });

    return NextResponse.json({ angles });
  } catch (error) {
    console.error("Error fetching video angles:", error);
    return NextResponse.json(
      { error: "Failed to fetch video angles" },
      { status: 500 }
    );
  }
}
