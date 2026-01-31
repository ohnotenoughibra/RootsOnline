import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";
import { sendEmail, certificateEarnedEmail } from "@/lib/email";

// GET all certificates for current user
export async function GET() {
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

    const certificates = await prisma.certificate.findMany({
      where: { userId: user.id },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            coverImage: true,
            discipline: true,
            coach: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: { completedAt: "desc" },
    });

    return NextResponse.json(certificates);
  } catch (error) {
    console.error("Error fetching certificates:", error);
    return NextResponse.json(
      { error: "Failed to fetch certificates" },
      { status: 500 }
    );
  }
}

// POST - generate certificate for completed course
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

    const { courseId } = await request.json();

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    // Check if certificate already exists
    const existingCertificate = await prisma.certificate.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId,
        },
      },
    });

    if (existingCertificate) {
      return NextResponse.json(existingCertificate);
    }

    // Verify course completion (all lessons completed)
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        modules: {
          include: {
            lessons: {
              where: { isPublished: true },
              select: { id: true },
            },
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const allLessonIds = course.modules.flatMap((m) =>
      m.lessons.map((l) => l.id)
    );

    const completedLessons = await prisma.lessonProgress.count({
      where: {
        userId: user.id,
        lessonId: { in: allLessonIds },
        completed: true,
      },
    });

    if (completedLessons < allLessonIds.length) {
      return NextResponse.json(
        {
          error: "Course not completed",
          completed: completedLessons,
          total: allLessonIds.length,
        },
        { status: 400 }
      );
    }

    // Generate unique certificate number
    const certificateNumber = `ROA-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const certificate = await prisma.certificate.create({
      data: {
        userId: user.id,
        courseId,
        certificateNumber,
      },
      include: {
        course: {
          select: {
            title: true,
            discipline: true,
          },
        },
      },
    });

    // Send certificate earned email
    if (user.email) {
      const email = certificateEarnedEmail({
        firstName: user.firstName || "there",
        courseTitle: certificate.course.title,
        certificateNumber,
      });
      await sendEmail({ to: user.email, ...email });
    }

    return NextResponse.json(certificate, { status: 201 });
  } catch (error) {
    console.error("Error generating certificate:", error);
    return NextResponse.json(
      { error: "Failed to generate certificate" },
      { status: 500 }
    );
  }
}
