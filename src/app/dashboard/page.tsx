import Link from "next/link";
import { redirect } from "next/navigation";
import Image from "next/image";
import { BookOpen, Clock, Award, Settings, Bookmark, FileText, Users, Flame, Trophy, Play, ArrowRight, Sparkles } from "lucide-react";

import { getCurrentUser, hasActiveSubscription } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { formatDuration, getDisciplineLabel } from "@/lib/utils";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const isSubscribed = await hasActiveSubscription();

  // Get user's progress data
  const lessonProgress = await prisma.lessonProgress.findMany({
    where: { userId: user.id },
    include: {
      lesson: {
        include: {
          module: {
            include: {
              course: {
                include: {
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
    orderBy: { updatedAt: "desc" },
    take: 10,
  });

  // Get unique courses from progress
  const coursesInProgress = Array.from(
    new Map(
      lessonProgress.map((p) => [p.lesson.module.courseId, p.lesson.module.course])
    ).values()
  );

  // Calculate progress for each course (batch queries to avoid N+1)
  const courseIds = coursesInProgress.map((c) => c.id);

  // Get courses with lesson counts using a single query
  const coursesWithCounts = await prisma.course.findMany({
    where: { id: { in: courseIds } },
    include: {
      modules: {
        include: {
          _count: { select: { lessons: true } },
        },
      },
    },
  });

  // Get all completed lessons for user in these courses (single query)
  const completedProgress = await prisma.lessonProgress.findMany({
    where: {
      userId: user.id,
      completed: true,
      lesson: { module: { courseId: { in: courseIds } } },
    },
    select: {
      lesson: {
        select: { module: { select: { courseId: true } } },
      },
    },
  });

  // Build progress map
  const courseProgressMap = new Map<string, { completed: number; total: number }>();

  // Calculate totals
  for (const course of coursesWithCounts) {
    const totalLessons = course.modules.reduce((sum, m) => sum + m._count.lessons, 0);
    courseProgressMap.set(course.id, { completed: 0, total: totalLessons });
  }

  // Count completed per course
  for (const progress of completedProgress) {
    const courseId = progress.lesson.module.courseId;
    const current = courseProgressMap.get(courseId);
    if (current) {
      current.completed += 1;
    }
  }

  // Calculate stats
  const completedLessons = lessonProgress.filter((p) => p.completed).length;
  const totalWatchTime = lessonProgress.reduce(
    (acc, p) => acc + p.watchedSeconds,
    0
  );

  // Get streak data
  const streak = await prisma.trainingStreak.findUnique({
    where: { userId: user.id },
  });

  // Get counts for quick stats
  const bookmarkCount = await prisma.bookmark.count({
    where: { userId: user.id },
  });

  const certificateCount = await prisma.certificate.count({
    where: { userId: user.id },
  });

  // Get recommended courses (courses user hasn't started)
  const recommendedCourses = await prisma.course.findMany({
    where: {
      status: "PUBLISHED",
      id: { notIn: courseIds.length > 0 ? courseIds : ["none"] },
    },
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
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
    take: 3,
  });

  // Get "What to learn next" - next unwatched lesson for each course in progress
  const nextLessons = [];
  for (const courseId of courseIds.slice(0, 3)) {
    const course = coursesWithCounts.find((c) => c.id === courseId);
    if (!course) continue;

    // Get all lessons for this course in order
    const courseLessons = await prisma.lesson.findMany({
      where: {
        module: { courseId },
        isPublished: true,
      },
      include: {
        module: {
          select: {
            title: true,
            order: true,
            course: {
              select: {
                title: true,
                slug: true,
                coverImage: true,
              },
            },
          },
        },
      },
      orderBy: [
        { module: { order: "asc" } },
        { order: "asc" },
      ],
    });

    // Get completed lesson IDs for this course
    const completedLessonIds = completedProgress
      .filter((p) => p.lesson.module.courseId === courseId)
      .map((p) => p.lesson.module.courseId);

    // Find first uncompleted lesson
    const userLessonProgress = await prisma.lessonProgress.findMany({
      where: {
        userId: user.id,
        lessonId: { in: courseLessons.map((l) => l.id) },
        completed: true,
      },
      select: { lessonId: true },
    });

    const completedIds = new Set(userLessonProgress.map((p) => p.lessonId));
    const nextLesson = courseLessons.find((l) => !completedIds.has(l.id));

    if (nextLesson) {
      nextLessons.push({
        ...nextLesson,
        courseName: nextLesson.module.course.title,
        courseSlug: nextLesson.module.course.slug,
        courseCover: nextLesson.module.course.coverImage,
      });
    }
  }

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back, {user.firstName || "Student"}!
            </h1>
            <p className="mt-1 text-muted-foreground">
              Track your progress and continue learning
            </p>
          </div>
          <Link href="/dashboard/settings">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </Link>
        </div>

        {/* Subscription Banner */}
        {!isSubscribed && (
          <Card className="mb-8 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <h3 className="font-semibold">Unlock Full Access</h3>
                <p className="text-sm text-muted-foreground">
                  Subscribe to access all courses and content
                </p>
              </div>
              <Link href="/pricing">
                <Button>View Plans</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Day Streak</CardTitle>
              <Flame className={`h-4 w-4 ${(streak?.currentStreak ?? 0) > 0 ? "text-orange-500" : "text-muted-foreground"}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{streak?.currentStreak ?? 0}</div>
              <p className="text-xs text-muted-foreground">Best: {streak?.longestStreak ?? 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Courses Started
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{coursesInProgress.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Lessons Completed
              </CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedLessons}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Watch Time
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatDuration(totalWatchTime)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* What to Learn Next */}
        {nextLessons.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">What to Learn Next</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {nextLessons.map((lesson) => (
                <Card key={lesson.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="flex">
                    {/* Thumbnail */}
                    <div className="w-24 h-24 bg-muted flex-shrink-0 relative">
                      {lesson.courseCover ? (
                        <Image
                          src={lesson.courseCover}
                          alt={lesson.courseName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Play className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    {/* Content */}
                    <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
                      <div>
                        <p className="text-xs text-muted-foreground truncate">
                          {lesson.courseName}
                        </p>
                        <h3 className="font-medium text-sm line-clamp-2 mt-1">
                          {lesson.title}
                        </h3>
                      </div>
                      <Link
                        href={`/courses/${lesson.courseSlug}/learn?lesson=${lesson.id}`}
                        className="inline-flex items-center text-xs text-primary hover:underline mt-2"
                      >
                        Continue learning
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Quick Access */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Link href="/dashboard/bookmarks">
            <Card className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <Bookmark className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Bookmarks</p>
                  <p className="text-sm text-muted-foreground">{bookmarkCount} saved</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/dashboard/notes">
            <Card className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30">
                  <FileText className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Notes</p>
                  <p className="text-sm text-muted-foreground">Your notes</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/dashboard/certificates">
            <Card className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium">Certificates</p>
                  <p className="text-sm text-muted-foreground">{certificateCount} earned</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/dashboard/referrals">
            <Card className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Refer Friends</p>
                  <p className="text-sm text-muted-foreground">Earn €20</p>
                </div>
              </div>
            </Card>
          </Link>
        </div>

        {/* Courses in Progress */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Continue Learning</h2>

          {coursesInProgress.length === 0 ? (
            <Card className="p-8 text-center">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold">No courses started yet</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Browse our courses and start learning today!
              </p>
              <Link href="/courses" className="inline-block mt-4">
                <Button>Browse Courses</Button>
              </Link>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {coursesInProgress.map((course) => {
                const disciplineVariant = course.discipline.toLowerCase() as
                  | "mma"
                  | "kickboxing"
                  | "grappling";

                const progress = courseProgressMap.get(course.id);
                const progressPercent = progress && progress.total > 0
                  ? Math.round((progress.completed / progress.total) * 100)
                  : 0;

                return (
                  <Card key={course.id} className="overflow-hidden">
                    <div className="h-32 bg-gradient-to-br from-primary/20 to-primary/5 relative">
                      <Badge
                        variant={disciplineVariant}
                        className="absolute top-3 left-3"
                      >
                        {getDisciplineLabel(course.discipline)}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold line-clamp-1">
                        {course.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {course.coach.firstName} {course.coach.lastName}
                      </p>

                      {/* Progress bar */}
                      <div className="mt-4">
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>Progress</span>
                          <span>{progressPercent}%</span>
                        </div>
                        <Progress value={progressPercent} className="h-2" />
                      </div>

                      <Link
                        href={`/courses/${course.slug}/learn`}
                        className="block mt-4"
                      >
                        <Button className="w-full" size="sm">
                          {progressPercent === 100 ? "Review" : "Continue"}
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </section>

        {/* Recent Activity */}
        {lessonProgress.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <Card>
              <CardContent className="p-0">
                <ul className="divide-y">
                  {lessonProgress.slice(0, 5).map((progress) => (
                    <li key={progress.id} className="p-4 flex items-center gap-4">
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          progress.completed
                            ? "bg-green-100 text-green-600"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {progress.completed ? (
                          <Award className="h-5 w-5" />
                        ) : (
                          <Clock className="h-5 w-5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {progress.lesson.title}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {progress.lesson.module.course.title}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatDuration(progress.watchedSeconds)} watched
                      </p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Recommended Courses */}
        {recommendedCourses.length > 0 && (
          <section className="mt-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Recommended For You</h2>
              <Link href="/courses">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recommendedCourses.map((course) => {
                const disciplineVariant = course.discipline.toLowerCase() as
                  | "mma"
                  | "kickboxing"
                  | "grappling";
                const totalLessons = course.modules.reduce(
                  (sum, m) => sum + m._count.lessons,
                  0
                );

                return (
                  <Card key={course.id} className="overflow-hidden">
                    <div className="h-32 bg-gradient-to-br from-primary/20 to-primary/5 relative">
                      <Badge
                        variant={disciplineVariant}
                        className="absolute top-3 left-3"
                      >
                        {getDisciplineLabel(course.discipline)}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold line-clamp-1">
                        {course.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {course.coach.firstName} {course.coach.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {totalLessons} lessons
                      </p>
                      <Link
                        href={`/courses/${course.slug}`}
                        className="block mt-4"
                      >
                        <Button variant="outline" className="w-full" size="sm">
                          View Course
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
