import Link from "next/link";
import type { Metadata } from "next";
import { BookOpen, ArrowLeft } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Business Courses | ROA",
  description: "Learn how to run a successful martial arts gym with our business courses.",
};

export default async function BusinessCoursesPage() {
  const courses = await prisma.course.findMany({
    where: {
      discipline: "BUSINESS",
      status: "PUBLISHED",
    },
    include: {
      coach: {
        select: {
          firstName: true,
          lastName: true,
          imageUrl: true,
        },
      },
      modules: {
        select: {
          id: true,
          _count: {
            select: { lessons: true },
          },
        },
      },
    },
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
  });

  // Calculate total lessons for each course
  const coursesWithStats = courses.map((course) => ({
    ...course,
    totalLessons: course.modules.reduce(
      (sum, module) => sum + module._count.lessons,
      0
    ),
    moduleCount: course.modules.length,
  }));

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/business"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Business Academy
          </Link>
          <h1 className="text-3xl font-bold">Business Courses</h1>
          <p className="mt-2 text-muted-foreground">
            Comprehensive courses on running a successful martial arts gym
          </p>
        </div>

        {/* Courses Grid */}
        {coursesWithStats.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coursesWithStats.map((course) => (
              <Link key={course.id} href={`/courses/${course.slug}`}>
                <Card className="h-full hover:shadow-md transition-shadow">
                  {course.coverImage && (
                    <div className="aspect-video relative overflow-hidden rounded-t-lg">
                      <img
                        src={course.coverImage}
                        alt={course.title}
                        className="object-cover w-full h-full"
                      />
                      {course.featured && (
                        <Badge className="absolute top-2 left-2">Featured</Badge>
                      )}
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                    <CardDescription className="line-clamp-3">
                      {course.shortDescription || course.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 mb-4">
                      {course.coach.imageUrl && (
                        <img
                          src={course.coach.imageUrl}
                          alt=""
                          className="h-8 w-8 rounded-full"
                        />
                      )}
                      <span className="text-sm">
                        {course.coach.firstName} {course.coach.lastName}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{course.moduleCount} modules</span>
                      <span>{course.totalLessons} lessons</span>
                    </div>
                    {course.price && (
                      <div className="mt-4 pt-4 border-t">
                        <span className="text-lg font-bold">
                          €{(course.price / 100).toFixed(2)}
                        </span>
                        <span className="text-sm text-muted-foreground ml-2">
                          one-time
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="py-16">
            <CardContent className="text-center">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Business courses coming soon
              </h3>
              <p className="text-muted-foreground mb-6">
                We're developing comprehensive courses on gym management, marketing,
                and more. Check back soon!
              </p>
              <Link href="/business/qa">
                <Button variant="outline">
                  Browse Q&A in the meantime
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
