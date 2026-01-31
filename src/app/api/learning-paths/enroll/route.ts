import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { userId: clerkId } = await auth();
    const { searchParams } = new URL(request.url);
    const pathId = searchParams.get("pathId");

    if (!clerkId) {
      return redirect("/sign-in");
    }

    if (!pathId) {
      return NextResponse.json(
        { error: "Learning path ID required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return redirect("/sign-in");
    }

    // Check if already enrolled
    const existing = await prisma.learningPathEnrollment.findUnique({
      where: {
        userId_learningPathId: {
          userId: user.id,
          learningPathId: pathId,
        },
      },
    });

    if (existing) {
      // Already enrolled, get path slug for redirect
      const path = await prisma.learningPath.findUnique({
        where: { id: pathId },
        select: { slug: true },
      });
      return redirect(`/learning-paths/${path?.slug}`);
    }

    // Get the learning path
    const learningPath = await prisma.learningPath.findUnique({
      where: { id: pathId, isPublished: true },
    });

    if (!learningPath) {
      return NextResponse.json(
        { error: "Learning path not found" },
        { status: 404 }
      );
    }

    // Create enrollment
    await prisma.learningPathEnrollment.create({
      data: {
        userId: user.id,
        learningPathId: pathId,
      },
    });

    return redirect(`/learning-paths/${learningPath.slug}`);
  } catch (error) {
    console.error("Error enrolling in learning path:", error);
    return NextResponse.json(
      { error: "Failed to enroll" },
      { status: 500 }
    );
  }
}
