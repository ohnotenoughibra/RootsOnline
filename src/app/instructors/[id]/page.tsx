import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Users, Award, Clock } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getInitials, getDisciplineLabel, formatDuration } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

interface InstructorPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getInstructor(id: string) {
  const instructor = await prisma.user.findUnique({
    where: { id, role: { in: ["COACH", "ADMIN"] } },
    include: {
      coursesCreated: {
        where: { status: "PUBLISHED" },
        include: {
          modules: {
            include: {
              _count: { select: { lessons: true } },
              lessons: {
                select: { videoDuration: true },
              },
            },
          },
        },
        orderBy: { publishedAt: "desc" },
      },
    },
  });

  return instructor;
}

export async function generateMetadata({
  params,
}: InstructorPageProps): Promise<Metadata> {
  const { id } = await params;
  const instructor = await getInstructor(id);

  if (!instructor) {
    return { title: "Instructor Not Found" };
  }

  const name = `${instructor.firstName} ${instructor.lastName}`;

  return {
    title: `${name} - Instructor`,
    description: `Learn martial arts from ${name} at Roots Online Academy. Browse their courses and start training today.`,
    openGraph: {
      title: `${name} | ROA Instructor`,
      description: `Learn martial arts from ${name}`,
      url: `${siteConfig.url}/instructors/${id}`,
      images: instructor.imageUrl ? [{ url: instructor.imageUrl }] : undefined,
    },
  };
}

export default async function InstructorPage({ params }: InstructorPageProps) {
  const { id } = await params;
  const instructor = await getInstructor(id);

  if (!instructor) {
    notFound();
  }

  const name = `${instructor.firstName} ${instructor.lastName}`;
  const totalCourses = instructor.coursesCreated.length;
  const totalLessons = instructor.coursesCreated.reduce(
    (acc, c) => acc + c.modules.reduce((a, m) => a + m._count.lessons, 0),
    0
  );
  const totalDuration = instructor.coursesCreated.reduce(
    (acc, c) =>
      acc +
      c.modules.reduce(
        (a, m) => a + m.lessons.reduce((l, lesson) => l + (lesson.videoDuration || 0), 0),
        0
      ),
    0
  );

  // Get unique disciplines
  const disciplines = [...new Set(instructor.coursesCreated.map((c) => c.discipline))];

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <Avatar className="h-32 w-32 mx-auto md:mx-0">
            <AvatarImage src={instructor.imageUrl || undefined} alt={name} />
            <AvatarFallback className="text-3xl">
              {getInitials(instructor.firstName, instructor.lastName)}
            </AvatarFallback>
          </Avatar>

          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl font-bold">{name}</h1>
            <p className="text-muted-foreground mt-1">Instructor at Roots Online Academy</p>

            {/* Disciplines */}
            <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
              {disciplines.map((discipline) => (
                <Badge
                  key={discipline}
                  variant={discipline.toLowerCase() as "mma" | "kickboxing" | "grappling"}
                >
                  {getDisciplineLabel(discipline)}
                </Badge>
              ))}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 mt-6 justify-center md:justify-start text-sm">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span>{totalCourses} courses</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-muted-foreground" />
                <span>{totalLessons} lessons</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{formatDuration(totalDuration)} of content</span>
              </div>
            </div>
          </div>
        </div>

        {/* Courses */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Courses by {instructor.firstName}</h2>

          {instructor.coursesCreated.length === 0 ? (
            <Card className="p-8 text-center">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No published courses yet.</p>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {instructor.coursesCreated.map((course) => {
                const lessonsCount = course.modules.reduce(
                  (acc, m) => acc + m._count.lessons,
                  0
                );
                const courseDuration = course.modules.reduce(
                  (acc, m) =>
                    acc + m.lessons.reduce((a, l) => a + (l.videoDuration || 0), 0),
                  0
                );

                return (
                  <Card key={course.id} className="overflow-hidden">
                    <div className="relative aspect-video bg-muted">
                      {course.coverImage ? (
                        <Image
                          src={course.coverImage}
                          alt={course.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <BookOpen className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <Badge
                        variant={
                          course.discipline.toLowerCase() as
                            | "mma"
                            | "kickboxing"
                            | "grappling"
                        }
                        className="mb-2"
                      >
                        {getDisciplineLabel(course.discipline)}
                      </Badge>
                      <h3 className="font-semibold line-clamp-2">{course.title}</h3>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {course.shortDescription || course.description}
                      </p>
                      <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                        <span>{lessonsCount} lessons</span>
                        <span>{formatDuration(courseDuration)}</span>
                      </div>
                      <Link href={`/courses/${course.slug}`} className="block mt-4">
                        <Button className="w-full" size="sm">
                          View Course
                        </Button>
                      </Link>
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
}
