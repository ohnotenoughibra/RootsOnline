import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function generateCertificateNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `RC-${timestamp}-${random}`;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { userId } = await auth();
    const { slug } = await params;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const certification = await prisma.instructorCertification.findUnique({
      where: { slug, isActive: true },
    });

    if (!certification) {
      return NextResponse.json(
        { error: "Certification not found" },
        { status: 404 }
      );
    }

    // Check if already applied
    const existingApplication = await prisma.certificationApplication.findUnique({
      where: {
        userId_certificationId: {
          userId: user.id,
          certificationId: certification.id,
        },
      },
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: "You have already applied for this certification" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { videoSubmissionUrl, resumeUrl, additionalNotes } = body;

    if (!videoSubmissionUrl) {
      return NextResponse.json(
        { error: "Video submission is required" },
        { status: 400 }
      );
    }

    // Calculate user's progress
    let completedCourseIds: string[] = [];
    let watchedHours = 0;

    // Get total watch time
    const progress = await prisma.lessonProgress.aggregate({
      where: { userId: user.id },
      _sum: { watchedSeconds: true },
    });
    watchedHours = (progress._sum.watchedSeconds || 0) / 3600;

    // Check completed courses
    if (certification.requiredCourseIds) {
      try {
        const requiredCourseIds = JSON.parse(certification.requiredCourseIds) as string[];

        for (const courseId of requiredCourseIds) {
          const courseModules = await prisma.module.findMany({
            where: { courseId },
            include: { lessons: { select: { id: true } } },
          });

          const allLessonIds = courseModules.flatMap((m) =>
            m.lessons.map((l) => l.id)
          );

          if (allLessonIds.length > 0) {
            const completedLessons = await prisma.lessonProgress.count({
              where: {
                userId: user.id,
                lessonId: { in: allLessonIds },
                completed: true,
              },
            });

            if (completedLessons === allLessonIds.length) {
              completedCourseIds.push(courseId);
            }
          }
        }
      } catch {
        // Invalid JSON, ignore
      }
    }

    // Create application
    const application = await prisma.certificationApplication.create({
      data: {
        userId: user.id,
        certificationId: certification.id,
        status: "PENDING",
        completedCourseIds: JSON.stringify(completedCourseIds),
        watchedHours,
        videoSubmissionUrl,
        resumeUrl: resumeUrl || null,
        additionalNotes: additionalNotes || null,
      },
    });

    // If there's no fee, or payment is handled separately
    // For now, we just create the application as PENDING

    return NextResponse.json({
      success: true,
      application: {
        id: application.id,
        status: application.status,
      },
    });
  } catch (error) {
    console.error("Error creating certification application:", error);
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    );
  }
}

// GET - Check application status
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { userId } = await auth();
    const { slug } = await params;

    if (!userId) {
      return NextResponse.json({ hasApplied: false });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ hasApplied: false });
    }

    const certification = await prisma.instructorCertification.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!certification) {
      return NextResponse.json({ hasApplied: false });
    }

    const application = await prisma.certificationApplication.findUnique({
      where: {
        userId_certificationId: {
          userId: user.id,
          certificationId: certification.id,
        },
      },
    });

    return NextResponse.json({
      hasApplied: !!application,
      application: application
        ? {
            id: application.id,
            status: application.status,
            certificateNumber: application.certificateNumber,
            issuedAt: application.issuedAt,
            expiresAt: application.expiresAt,
          }
        : null,
    });
  } catch (error) {
    console.error("Error checking application:", error);
    return NextResponse.json({ hasApplied: false });
  }
}
