import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Play, Clock, BookOpen, ArrowRight } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { hasActiveSubscription } from "@/lib/auth";
import { Button } from "@/components/ui/button";
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
    <div className="flex flex-col">
      {/* Header */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/techniques"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Techniques
          </Link>

          <p className="text-sm text-muted-foreground mb-2">
            {getDisciplineLabel(technique.discipline)}
          </p>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {technique.name}
          </h1>

          {technique.description && (
            <p className="mt-4 text-lg text-muted-foreground">
              {technique.description}
            </p>
          )}

          <div className="mt-6 flex items-center gap-6 text-sm text-muted-foreground">
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
      </section>

      {/* Content */}
      <section className="border-t py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {lessons.length === 0 ? (
            <div className="text-center py-12 border rounded-xl">
              <BookOpen className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
              <h2 className="text-lg font-semibold mb-2">Coming Soon</h2>
              <p className="text-muted-foreground">
                We&apos;re working on adding lessons for this technique.
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {courseGroups.map(({ course, lessons }) => (
                <div key={course.id}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-semibold">{course.title}</h2>
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

                  <div className="space-y-2">
                    {lessons.map((lesson) => {
                      const canWatch = lesson.isFreePreview || isSubscribed;

                      return (
                        <Link
                          key={lesson.id}
                          href={canWatch ? `/courses/${course.slug}/learn?lesson=${lesson.id}` : `/courses/${course.slug}`}
                          className="block"
                        >
                          <div className="p-4 rounded-lg border hover:border-foreground/50 transition-colors">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className={`p-2 rounded-lg ${canWatch ? "bg-foreground/10" : "bg-muted"}`}>
                                  <Play className={`h-4 w-4 ${canWatch ? "" : "text-muted-foreground"}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-medium">{lesson.title}</h3>
                                  {lesson.description && (
                                    <p className="text-sm text-muted-foreground line-clamp-1">
                                      {lesson.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-3 ml-4">
                                {lesson.isFreePreview && (
                                  <span className="text-xs px-2 py-1 rounded border">Free</span>
                                )}
                                {lesson.videoDuration && (
                                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {formatDuration(lesson.videoDuration)}
                                  </span>
                                )}
                                {!canWatch && (
                                  <span className="text-xs px-2 py-1 rounded border border-dashed">Premium</span>
                                )}
                              </div>
                            </div>
                          </div>
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
            <div className="mt-16 rounded-xl border p-8 text-center">
              <h2 className="text-xl font-bold mb-2">Unlock All Lessons</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Subscribe to access all {lessons.length} lessons covering {technique.name} and our entire technique library.
              </p>
              <Link href="/pricing">
                <Button>
                  View Plans
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
