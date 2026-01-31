import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Clock, BookOpen, User } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { hasActiveSubscription, getCurrentUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CourseCurriculum } from "@/components/course/course-curriculum";
import { getDisciplineLabel, getInitials, formatDuration } from "@/lib/utils";

interface CoursePageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getCourse(slug: string) {
  const course = await prisma.course.findUnique({
    where: { slug, status: "PUBLISHED" },
    include: {
      coach: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          imageUrl: true,
        },
      },
      modules: {
        orderBy: { order: "asc" },
        include: {
          lessons: {
            orderBy: { order: "asc" },
          },
        },
      },
    },
  });

  return course;
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params;
  const course = await getCourse(slug);

  if (!course) {
    notFound();
  }

  const isSubscribed = await hasActiveSubscription();
  const user = await getCurrentUser();

  const totalLessons = course.modules.reduce(
    (acc, m) => acc + m.lessons.length,
    0
  );
  const totalDuration = course.modules.reduce(
    (acc, m) =>
      acc + m.lessons.reduce((a, l) => a + (l.videoDuration || 0), 0),
    0
  );

  const disciplineVariant = course.discipline.toLowerCase() as
    | "mma"
    | "kickboxing"
    | "grappling";

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            {/* Content */}
            <div>
              <Badge variant={disciplineVariant} className="mb-4">
                {getDisciplineLabel(course.discipline)}
              </Badge>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                {course.title}
              </h1>

              <p className="mt-4 text-lg text-gray-300">
                {course.shortDescription || course.description.slice(0, 200)}
              </p>

              {/* Coach info */}
              <div className="mt-6 flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={course.coach.imageUrl || undefined} />
                  <AvatarFallback>
                    {getInitials(course.coach.firstName, course.coach.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {course.coach.firstName} {course.coach.lastName}
                  </p>
                  <p className="text-sm text-gray-400">Course Instructor</p>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-6 flex items-center gap-6 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>{totalLessons} lessons</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{formatDuration(totalDuration)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{course.modules.length} modules</span>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                {isSubscribed ? (
                  <Link href={`/courses/${course.slug}/learn`}>
                    <Button size="lg" className="w-full sm:w-auto">
                      Continue Learning
                    </Button>
                  </Link>
                ) : user ? (
                  <Link href="/pricing">
                    <Button size="lg" className="w-full sm:w-auto">
                      Subscribe to Access
                    </Button>
                  </Link>
                ) : (
                  <Link href="/sign-up">
                    <Button size="lg" className="w-full sm:w-auto">
                      Sign Up to Access
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            {/* Cover Image */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-800">
              {course.coverImage ? (
                <Image
                  src={course.coverImage}
                  alt={course.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <BookOpen className="h-16 w-16 text-gray-600" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Description */}
            <section>
              <h2 className="text-2xl font-bold mb-4">About This Course</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {course.description}
                </p>
              </div>
            </section>

            {/* Curriculum */}
            <section className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Course Curriculum</h2>
              <CourseCurriculum
                modules={course.modules}
                isSubscribed={isSubscribed}
              />
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Pricing card for non-subscribers */}
              {!isSubscribed && (
                <div className="rounded-xl border bg-card p-6">
                  <h3 className="font-semibold text-lg">Get Full Access</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Subscribe to unlock all lessons in this course and our
                    entire library.
                  </p>

                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Weekly</span>
                      <span className="font-medium">€5/week</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Yearly</span>
                      <span className="font-medium">€99/year</span>
                    </div>
                  </div>

                  <Link href="/pricing" className="block mt-4">
                    <Button className="w-full">View Plans</Button>
                  </Link>
                </div>
              )}

              {/* Course info */}
              <div className="rounded-xl border bg-card p-6">
                <h3 className="font-semibold text-lg">Course Info</h3>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Discipline</dt>
                    <dd className="font-medium">
                      {getDisciplineLabel(course.discipline)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Modules</dt>
                    <dd className="font-medium">{course.modules.length}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Lessons</dt>
                    <dd className="font-medium">{totalLessons}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Total Duration</dt>
                    <dd className="font-medium">{formatDuration(totalDuration)}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
