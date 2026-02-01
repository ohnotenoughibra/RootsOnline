import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Play, Clock, BookOpen } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { hasActiveSubscription } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getDisciplineLabel, formatDuration } from "@/lib/utils";

interface TechniquePageProps {
  params: Promise<{ slug: string }>;
}

async function getTechnique(slug: string) {
  const technique = await prisma.techniqueTag.findUnique({
    where: { slug },
    include: {
      lessons: {
        include: {
          lesson: {
            include: {
              module: {
                include: {
                  course: {
                    select: {
                      id: true,
                      title: true,
                      slug: true,
                      status: true,
                      coach: {
                        select: {
                          firstName: true,
                          lastName: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  return technique;
}

export default async function TechniquePage({ params }: TechniquePageProps) {
  const { slug } = await params;
  const technique = await getTechnique(slug);

  if (!technique) {
    notFound();
  }

  const isSubscribed = await hasActiveSubscription();

  // Filter to only show lessons from published courses
  const lessons = technique.lessons
    .filter((lt) => lt.lesson.module.course.status === "PUBLISHED")
    .map((lt) => ({
      ...lt.lesson,
      course: lt.lesson.module.course,
    }));

  // Group lessons by course
  const lessonsByCourse = lessons.reduce((acc, lesson) => {
    const courseId = lesson.course.id;
    if (!acc[courseId]) {
      acc[courseId] = {
        course: lesson.course,
        lessons: [],
      };
    }
    acc[courseId].lessons.push(lesson);
    return acc;
  }, {} as Record<string, { course: typeof lessons[0]["course"]; lessons: typeof lessons }>);

  const courseGroups = Object.values(lessonsByCourse);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link href="/techniques">
            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white mb-4">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Techniques
            </Button>
          </Link>

          <Badge variant={technique.discipline.toLowerCase() as "mma" | "kickboxing" | "grappling"} className="mb-4">
            {getDisciplineLabel(technique.discipline)}
          </Badge>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {technique.name}
          </h1>

          {technique.description && (
            <p className="mt-4 text-lg text-gray-300 max-w-2xl">
              {technique.description}
            </p>
          )}

          <div className="mt-6 flex items-center gap-4 text-sm text-gray-300">
            <span className="flex items-center gap-1">
              <Play className="h-4 w-4" />
              {lessons.length} lessons
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              {courseGroups.length} courses
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {lessons.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">Coming Soon</h2>
              <p className="text-muted-foreground">
                We&apos;re working on adding lessons for this technique.
                Check back soon!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {courseGroups.map(({ course, lessons }) => (
              <div key={course.id}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold">{course.title}</h2>
                    <p className="text-sm text-muted-foreground">
                      by {course.coach.firstName} {course.coach.lastName}
                    </p>
                  </div>
                  <Link href={`/courses/${course.slug}`}>
                    <Button variant="outline" size="sm">
                      View Course
                    </Button>
                  </Link>
                </div>

                <div className="grid gap-3">
                  {lessons.map((lesson) => {
                    const canWatch = lesson.isFreePreview || isSubscribed;

                    return (
                      <Link
                        key={lesson.id}
                        href={canWatch ? `/courses/${course.slug}/learn?lesson=${lesson.id}` : `/courses/${course.slug}`}
                      >
                        <Card className="hover:shadow-md transition-shadow">
                          <CardContent className="py-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${canWatch ? "bg-primary/10" : "bg-muted"}`}>
                                  <Play className={`h-4 w-4 ${canWatch ? "text-primary" : "text-muted-foreground"}`} />
                                </div>
                                <div>
                                  <h3 className="font-medium">{lesson.title}</h3>
                                  {lesson.description && (
                                    <p className="text-sm text-muted-foreground line-clamp-1">
                                      {lesson.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                {lesson.isFreePreview && (
                                  <Badge variant="secondary">Free</Badge>
                                )}
                                {lesson.videoDuration && (
                                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {formatDuration(lesson.videoDuration)}
                                  </span>
                                )}
                                {!canWatch && (
                                  <Badge variant="outline">Premium</Badge>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Subscribe CTA for non-subscribers */}
        {!isSubscribed && lessons.length > 0 && (
          <div className="mt-12 rounded-xl border bg-card p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">Unlock All Lessons</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Subscribe to access all {lessons.length} lessons covering {technique.name} and our entire technique library.
            </p>
            <Link href="/pricing">
              <Button size="lg">View Plans</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
