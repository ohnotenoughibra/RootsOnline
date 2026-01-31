import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

// GET - check onboarding status
export async function GET() {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
      select: {
        onboardingCompleted: true,
        experienceLevel: true,
        trainingGoals: true,
        preferredDisciplines: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      completed: user.onboardingCompleted,
      experienceLevel: user.experienceLevel,
      trainingGoals: user.trainingGoals ? JSON.parse(user.trainingGoals) : [],
      preferredDisciplines: user.preferredDisciplines
        ? JSON.parse(user.preferredDisciplines)
        : [],
    });
  } catch (error) {
    console.error("Error checking onboarding:", error);
    return NextResponse.json(
      { error: "Failed to check onboarding status" },
      { status: 500 }
    );
  }
}

// POST - save onboarding data
export async function POST(request: Request) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { experienceLevel, trainingGoals, preferredDisciplines } =
      await request.json();

    const user = await prisma.user.update({
      where: { clerkId },
      data: {
        onboardingCompleted: true,
        experienceLevel,
        trainingGoals: JSON.stringify(trainingGoals || []),
        preferredDisciplines: JSON.stringify(preferredDisciplines || []),
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        onboardingCompleted: user.onboardingCompleted,
        experienceLevel: user.experienceLevel,
      },
    });
  } catch (error) {
    console.error("Error saving onboarding:", error);
    return NextResponse.json(
      { error: "Failed to save onboarding data" },
      { status: 500 }
    );
  }
}

// PATCH - skip onboarding
export async function PATCH() {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.user.update({
      where: { clerkId },
      data: {
        onboardingCompleted: true,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error skipping onboarding:", error);
    return NextResponse.json(
      { error: "Failed to skip onboarding" },
      { status: 500 }
    );
  }
}
