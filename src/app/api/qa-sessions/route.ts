import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

// GET Q&A sessions for current user
export async function GET(request: Request) {
  try {
    const { userId: clerkId } = await auth();
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role") || "student"; // student or coach

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const sessions = await prisma.qASession.findMany({
      where:
        role === "coach"
          ? { coachId: user.id }
          : { studentId: user.id },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            imageUrl: true,
          },
        },
        coach: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            imageUrl: true,
          },
        },
      },
      orderBy: { scheduledAt: "desc" },
    });

    return NextResponse.json(sessions);
  } catch (error) {
    console.error("Error fetching Q&A sessions:", error);
    return NextResponse.json(
      { error: "Failed to fetch sessions" },
      { status: 500 }
    );
  }
}

// POST - Book a new Q&A session
export async function POST(request: Request) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check subscription (only annual subscribers get priority Q&A)
    if (user.subscriptionStatus !== "ACTIVE") {
      return NextResponse.json(
        { error: "Active subscription required to book Q&A sessions" },
        { status: 403 }
      );
    }

    const { coachId, topic, questions, scheduledAt, duration } = await request.json();

    if (!coachId || !topic || !questions || !scheduledAt) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify coach exists
    const coach = await prisma.user.findFirst({
      where: { id: coachId, role: { in: ["COACH", "ADMIN"] } },
    });

    if (!coach) {
      return NextResponse.json({ error: "Coach not found" }, { status: 404 });
    }

    // Check for conflicting sessions
    const sessionDate = new Date(scheduledAt);
    const sessionEnd = new Date(sessionDate.getTime() + (duration || 30) * 60000);

    const conflictingSession = await prisma.qASession.findFirst({
      where: {
        coachId,
        status: { in: ["PENDING", "CONFIRMED"] },
        scheduledAt: {
          gte: new Date(sessionDate.getTime() - 60 * 60000), // 1 hour buffer
          lte: sessionEnd,
        },
      },
    });

    if (conflictingSession) {
      return NextResponse.json(
        { error: "This time slot is not available" },
        { status: 409 }
      );
    }

    const session = await prisma.qASession.create({
      data: {
        studentId: user.id,
        coachId,
        topic,
        questions,
        scheduledAt: sessionDate,
        duration: duration || 30,
        status: "PENDING",
      },
      include: {
        coach: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json(session, { status: 201 });
  } catch (error) {
    console.error("Error creating Q&A session:", error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }
}

// PATCH - Update session status (for coaches)
export async function PATCH(request: Request) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { sessionId, status, meetingUrl, notes } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID required" },
        { status: 400 }
      );
    }

    // Get the session
    const session = await prisma.qASession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Only coach can update status, or student can cancel their own
    const isCoach = session.coachId === user.id;
    const isStudent = session.studentId === user.id;

    if (!isCoach && !isStudent) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // Students can only cancel
    if (isStudent && status !== "CANCELLED") {
      return NextResponse.json(
        { error: "Students can only cancel sessions" },
        { status: 403 }
      );
    }

    const updatedSession = await prisma.qASession.update({
      where: { id: sessionId },
      data: {
        ...(status && { status }),
        ...(meetingUrl && { meetingUrl }),
        ...(notes && { notes }),
      },
    });

    return NextResponse.json(updatedSession);
  } catch (error) {
    console.error("Error updating Q&A session:", error);
    return NextResponse.json(
      { error: "Failed to update session" },
      { status: 500 }
    );
  }
}
