import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { GraduationCap, Clock, BookOpen, CheckCircle2, Circle, Lock } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { getCurrentUser, hasActiveSubscription } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getDisciplineLabel } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";

interface LearningPathPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getLearningPath(slug: string) {
  const path = await prisma.learningPath.findUnique({
    where: { slug, isPublished: true },
    include: {
      items: {
        include: {
          course: {
            include: {
              coach: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
              modules: {
                include: {
                  _count: { select: { lessons: true } },
                },
              },
            },
          },
        },
        orderBy: { order: "asc" },
      },
    },
  });

  return path;
}

export async function generateMetadata({
  params,
}: LearningPathPageProps): Promise<Metadata> {
  const { slug } = await params;
  const path = await getLearningPath(slug);

  if (!path) {
    return { title: "Learning Path Not Found" };
  }

  return {
    title: `${path.title} - Learning Path`,
    description: path.description,
    openGraph: {
      title: `${path.title} | ROA Learning Path`,
      description: path.description,
      url: `${siteConfig.url}/learning-paths/${slug}`,
      images: path.coverImage ? [{ url: path.coverImage }] : undefined,
    },
  };
}

const difficultyColors = {
  BEGINNER: "bg-green-100 text-green-700",
  INTERMEDIATE: "bg-yellow-100 text-yellow-700",
  ADVANCED: "bg-red-100 text-red-700",
};

export default async function LearningPathPage({ params }: LearningPathPageProps) {
  const { slug } = await params;
  const path = await getLearningPath(slug);

  if (!path) {
    notFound();
  }

  const user = await getCurrentUser();
  const isSubscribed = await hasActiveSubscription();

  // Get user's progress on courses in this path
  let userProgress: Record<string, number> = {};
  let enrollment = null;

  if (user) {
    enrollment = await prisma.learningPathEnrollment.findUnique({
      where: {
        userId_learningPathId: {
          userId: user.id,
          learningPathId: path.id,
        },
      },
    });

    // Calculate progress for each course
    const courseIds = path.items.map((item) => item.courseId);
    const lessonProgress = await prisma.lessonProgress.findMany({
      where: {
        userId: user.id,
        lesson: {
          module: { courseId: { in: courseIds } },
        },
        completed: true,
      },
      select: {
        lesson: {
          select: {
            module: { select: { courseId: true } },
          },
        },
      },
    });

    // Count completed lessons per course
    const completedPerCourse: Record<string, number> = {};
    lessonProgress.forEach((p) => {
      const courseId = p.lesson.module.courseId;
      completedPerCourse[courseId] = (completedPerCourse[courseId] || 0) + 1;
    });

    // Calculate percentage for each course
    path.items.forEach((item) => {
      const totalLessons = item.course.modules.reduce((acc, m) => acc + m._count.lessons, 0);
      const completed = completedPerCourse[item.courseId] || 0;
      userProgress[item.courseId] = totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;
    });
  }

  // Calculate overall progress
  const totalCourses = path.items.length;
  const completedCourses = Object.values(userProgress).filter((p) => p === 100).length;
  const overallProgress = totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0;

  return (
    <div className="py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge
              variant={
                path.discipline.toLowerCase() as
                  | "mma"
                  | "kickboxing"
                  | "grappling"
              }
            >
              {getDisciplineLabel(path.discipline)}
            </Badge>
            <Badge
              className={
                difficultyColors[
                  path.difficulty as keyof typeof difficultyColors
                ] || difficultyColors.BEGINNER
              }
            >
              {path.difficulty}
            </Badge>
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {path.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {path.description}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-6 mt-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              {path.items.length} courses
            </span>
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              ~{path.estimatedWeeks} weeks
            </span>
          </div>

          {/* Progress (if enrolled) */}
          {enrollment && (
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Your Progress</span>
                <span className="text-sm text-muted-foreground">
                  {completedCourses}/{totalCourses} courses completed
                </span>
              </div>
              <Progress value={overallProgress} className="h-2" />
            </div>
          )}

          {/* Enroll button */}
          {!enrollment && user && (
            <div className="mt-6">
              <form action={`/api/learning-paths/enroll?pathId=${path.id}`} method="POST">
                <Button type="submit" size="lg">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Start This Path
                </Button>
              </form>
            </div>
          )}

          {!user && (
            <div className="mt-6">
              <Link href="/sign-up">
                <Button size="lg">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Sign Up to Start
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Course List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Courses in This Path</h2>

          {path.items.map((item, index) => {
            const course = item.course;
            const progress = userProgress[course.id] || 0;
            const isCompleted = progress === 100;
            const isLocked = !isSubscribed && index > 0;
            const totalLessons = course.modules.reduce((acc, m) => acc + m._count.lessons, 0);

            return (
              <Card
                key={item.id}
                className={`overflow-hidden ${isLocked ? "opacity-60" : ""}`}
              >
                <div className="flex">
                  {/* Order indicator */}
                  <div className="w-16 flex-shrink-0 bg-muted flex items-center justify-center">
                    {isCompleted ? (
                      <CheckCircle2 className="h-8 w-8 text-green-500" />
                    ) : isLocked ? (
                      <Lock className="h-6 w-6 text-muted-foreground" />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-bold text-primary">{index + 1}</span>
                      </div>
                    )}
                  </div>

                  {/* Course info */}
                  <CardContent className="flex-1 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{course.title}</h3>
                          {!item.isRequired && (
                            <Badge variant="outline" className="text-xs">
                              Optional
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {course.coach.firstName} {course.coach.lastName} •{" "}
                          {totalLessons} lessons
                        </p>
                        {progress > 0 && progress < 100 && (
                          <div className="mt-2">
                            <Progress value={progress} className="h-1 w-32" />
                            <span className="text-xs text-muted-foreground">
                              {progress}% complete
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="ml-4">
                        {isLocked ? (
                          <Link href="/pricing">
                            <Button variant="outline" size="sm">
                              Unlock
                            </Button>
                          </Link>
                        ) : (
                          <Link href={`/courses/${course.slug}`}>
                            <Button
                              variant={isCompleted ? "outline" : "default"}
                              size="sm"
                            >
                              {isCompleted
                                ? "Review"
                                : progress > 0
                                ? "Continue"
                                : "Start"}
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
