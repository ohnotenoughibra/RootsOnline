import Link from "next/link";
import { redirect } from "next/navigation";
import { BookOpen, Clock, Award, Settings } from "lucide-react";

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

  // Calculate stats
  const completedLessons = lessonProgress.filter((p) => p.completed).length;
  const totalWatchTime = lessonProgress.reduce(
    (acc, p) => acc + p.watchedSeconds,
    0
  );

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
        <div className="grid gap-4 md:grid-cols-3 mb-8">
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

                      {/* Progress bar placeholder */}
                      <div className="mt-4">
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>Progress</span>
                          <span>0%</span>
                        </div>
                        <Progress value={0} className="h-2" />
                      </div>

                      <Link
                        href={`/courses/${course.slug}/learn`}
                        className="block mt-4"
                      >
                        <Button className="w-full" size="sm">
                          Continue
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
      </div>
    </div>
  );
}
