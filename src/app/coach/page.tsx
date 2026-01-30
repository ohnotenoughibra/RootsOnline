import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, BookOpen, Users, Eye, AlertCircle } from "lucide-react";

import { getCurrentUser, isCoach } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getDisciplineLabel } from "@/lib/utils";

export default async function CoachDashboardPage() {
  try {
    const user = await getCurrentUser();
    const canAccess = await isCoach();

    if (!user) {
      redirect("/sign-in");
    }

    if (!canAccess) {
      return (
        <div className="py-12">
          <div className="mx-auto max-w-2xl px-4 text-center">
            <Card className="p-8">
              <AlertCircle className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
              <h1 className="text-2xl font-bold mb-2">Coach Access Required</h1>
              <p className="text-muted-foreground mb-6">
                You need coach permissions to access this area. Contact an admin to upgrade your account.
              </p>
              <Link href="/dashboard">
                <Button>Go to Dashboard</Button>
              </Link>
            </Card>
          </div>
        </div>
      );
    }

    // Get coach's courses
    const courses = await prisma.course.findMany({
      where: { coachId: user.id },
      include: {
        _count: {
          select: {
            modules: true,
          },
        },
        modules: {
          include: {
            _count: {
              select: {
                lessons: true,
              },
            },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    const totalCourses = courses.length;
    const publishedCourses = courses.filter((c) => c.status === "PUBLISHED").length;
    const totalLessons = courses.reduce(
      (acc, c) => acc + c.modules.reduce((a, m) => a + m._count.lessons, 0),
      0
    );

    return (
      <div className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Coach Studio</h1>
              <p className="mt-1 text-muted-foreground">
                Create and manage your courses
              </p>
            </div>
            <Link href="/coach/courses/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Course
              </Button>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-3 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Courses
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalCourses}</div>
                <p className="text-xs text-muted-foreground">
                  {publishedCourses} published
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Lessons
                </CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalLessons}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">-</div>
                <p className="text-xs text-muted-foreground">Coming soon</p>
              </CardContent>
            </Card>
          </div>

          {/* Courses List */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Your Courses</h2>

            {courses.length === 0 ? (
              <Card className="p-8 text-center">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold">No courses yet</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Create your first course and start sharing your expertise!
                </p>
                <Link href="/coach/courses/new" className="inline-block mt-4">
                  <Button>Create Course</Button>
                </Link>
              </Card>
            ) : (
              <div className="grid gap-4">
                {courses.map((course) => {
                  const lessonsCount = course.modules.reduce(
                    (acc, m) => acc + m._count.lessons,
                    0
                  );

                  return (
                    <Card key={course.id}>
                      <CardContent className="flex items-center gap-4 p-4">
                        <div
                          className={`h-16 w-24 rounded-md flex items-center justify-center ${
                            course.discipline === "MMA"
                              ? "bg-red-100"
                              : course.discipline === "KICKBOXING"
                              ? "bg-orange-100"
                              : "bg-blue-100"
                          }`}
                        >
                          <BookOpen
                            className={`h-6 w-6 ${
                              course.discipline === "MMA"
                                ? "text-red-500"
                                : course.discipline === "KICKBOXING"
                                ? "text-orange-500"
                                : "text-blue-500"
                            }`}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold truncate">
                              {course.title}
                            </h3>
                            <Badge
                              variant={
                                course.status === "PUBLISHED"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {course.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {getDisciplineLabel(course.discipline)} •{" "}
                            {course._count.modules} modules • {lessonsCount} lessons
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Link href={`/coach/courses/${course.id}`}>
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                          </Link>
                          {course.status === "PUBLISHED" && (
                            <Link href={`/courses/${course.slug}`}>
                              <Button variant="ghost" size="sm">
                                View
                              </Button>
                            </Link>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Coach page error:", error);

    return (
      <div className="py-12">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <Card className="p-8">
            <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
            <h1 className="text-2xl font-bold mb-2">Database Setup Required</h1>
            <p className="text-muted-foreground mb-4">
              The database needs to be set up before you can access the coach area.
            </p>
            <div className="text-left bg-muted p-4 rounded-lg mb-6 text-sm">
              <p className="font-medium mb-2">Setup options:</p>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>Run <code className="bg-background px-1 rounded">npm run db:push</code> to sync schema with Prisma</li>
                <li>Or copy <code className="bg-background px-1 rounded">scripts/setup-database.sql</code> into your Neon SQL Editor</li>
                <li>Then run <code className="bg-background px-1 rounded">npm run db:seed</code> to add sample data</li>
              </ol>
            </div>
            <Link href="/">
              <Button>Go Home</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }
}
