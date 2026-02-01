import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET - Get all students who have progress on coach's courses
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user || (user.role !== "COACH" && user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // Get coach's courses
    const coachCourses = await prisma.course.findMany({
      where: user.role === "ADMIN" ? {} : { coachId: user.id },
      select: { id: true, title: true, slug: true },
    });

    const courseIds = coachCourses.map((c) => c.id);

    // Get all lesson progress for these courses
    const lessonProgress = await prisma.lessonProgress.findMany({
      where: {
        lesson: {
          module: {
            courseId: { in: courseIds },
          },
        },
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            imageUrl: true,
            createdAt: true,
          },
        },
        lesson: {
          select: {
            id: true,
            title: true,
            videoDuration: true,
            module: {
              select: {
                id: true,
                title: true,
                course: {
                  select: {
                    id: true,
                    title: true,
                    slug: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    // Aggregate by student
    const studentMap = new Map<
      string,
      {
        user: typeof lessonProgress[0]["user"];
        totalLessonsStarted: number;
        totalLessonsCompleted: number;
        totalWatchTime: number;
        lastActive: Date;
        courses: Map<
          string,
          {
            course: { id: string; title: string; slug: string };
            lessonsStarted: number;
            lessonsCompleted: number;
            watchTime: number;
            lastLesson: {
              title: string;
              completed: boolean;
              progress: number;
            } | null;
          }
        >;
      }
    >();

    for (const progress of lessonProgress) {
      const studentId = progress.userId;

      if (!studentMap.has(studentId)) {
        studentMap.set(studentId, {
          user: progress.user,
          totalLessonsStarted: 0,
          totalLessonsCompleted: 0,
          totalWatchTime: 0,
          lastActive: progress.updatedAt,
          courses: new Map(),
        });
      }

      const student = studentMap.get(studentId)!;

      // Update totals
      student.totalLessonsStarted++;
      if (progress.completed) {
        student.totalLessonsCompleted++;
      }
      student.totalWatchTime += progress.watchedSeconds || 0;

      // Update last active
      if (progress.updatedAt > student.lastActive) {
        student.lastActive = progress.updatedAt;
      }

      // Update course-specific stats
      const courseId = progress.lesson.module.course.id;
      if (!student.courses.has(courseId)) {
        student.courses.set(courseId, {
          course: progress.lesson.module.course,
          lessonsStarted: 0,
          lessonsCompleted: 0,
          watchTime: 0,
          lastLesson: null,
        });
      }

      const courseStats = student.courses.get(courseId)!;
      courseStats.lessonsStarted++;
      if (progress.completed) {
        courseStats.lessonsCompleted++;
      }
      courseStats.watchTime += progress.watchedSeconds || 0;

      // Track last lesson
      const lessonProgress100 = progress.lesson.videoDuration
        ? Math.min(100, Math.round((progress.watchedSeconds / progress.lesson.videoDuration) * 100))
        : 0;

      if (!courseStats.lastLesson || progress.updatedAt > student.lastActive) {
        courseStats.lastLesson = {
          title: progress.lesson.title,
          completed: progress.completed,
          progress: lessonProgress100,
        };
      }
    }

    // Convert to array and sort by last active
    const students = Array.from(studentMap.values())
      .map((student) => ({
        ...student,
        courses: Array.from(student.courses.values()),
      }))
      .sort((a, b) => b.lastActive.getTime() - a.lastActive.getTime());

    // Calculate summary stats
    const summary = {
      totalStudents: students.length,
      activeThisWeek: students.filter(
        (s) => s.lastActive > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length,
      activeThisMonth: students.filter(
        (s) => s.lastActive > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      ).length,
      totalWatchTime: students.reduce((sum, s) => sum + s.totalWatchTime, 0),
      totalCompletions: students.reduce((sum, s) => sum + s.totalLessonsCompleted, 0),
    };

    return NextResponse.json({
      students,
      summary,
      courses: coachCourses,
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    );
  }
}
