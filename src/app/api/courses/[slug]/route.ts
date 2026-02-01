import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { userId } = await auth();

    // First, try to find the course (published or draft)
    const course = await prisma.course.findUnique({
      where: { slug },
      include: {
        coach: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            imageUrl: true,
            clerkId: true,
          },
        },
        modules: {
          orderBy: { order: "asc" },
          include: {
            lessons: {
              where: { isPublished: true },
              orderBy: { order: "asc" },
            },
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // If course is DRAFT, only allow the owner, coaches, or admins to view
    if (course.status !== "PUBLISHED") {
      if (!userId) {
        return NextResponse.json(
          { error: "Course not found" },
          { status: 404 }
        );
      }

      const user = await prisma.user.findUnique({
        where: { clerkId: userId },
      });

      // Allow if user is the course owner, a coach, or admin
      const isOwner = course.coach?.clerkId === userId;
      const isCoachOrAdmin = user?.role === "COACH" || user?.role === "ADMIN";

      if (!isOwner && !isCoachOrAdmin) {
        return NextResponse.json(
          { error: "Course not found" },
          { status: 404 }
        );
      }
    }

    return NextResponse.json({ course });
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json(
      { error: "Failed to fetch course" },
      { status: 500 }
    );
  }
}
