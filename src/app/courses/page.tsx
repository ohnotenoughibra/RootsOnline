import { Suspense } from "react";
import { Search, BookOpen } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { CourseGrid } from "@/components/course/course-grid";
import { DisciplineFilter } from "@/components/course/discipline-filter";
import { LanguageFilter } from "@/components/course/language-filter";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import type { Discipline, Language } from "@/types";

interface CoursesPageProps {
  searchParams: Promise<{
    discipline?: string;
    language?: string;
    search?: string;
  }>;
}

async function getCourses(discipline?: string, language?: string, search?: string) {
  try {
    const where: {
      status: "PUBLISHED";
      discipline?: Discipline;
      language?: Language;
      OR?: Array<{
        title?: { contains: string; mode: "insensitive" };
        description?: { contains: string; mode: "insensitive" };
      }>;
    } = {
      status: "PUBLISHED",
    };

    if (discipline && ["MMA", "KICKBOXING", "GRAPPLING"].includes(discipline)) {
      where.discipline = discipline as Discipline;
    }

    if (language && ["EN", "DE", "ES", "PT", "FR"].includes(language)) {
      where.language = language as Language;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const courses = await prisma.course.findMany({
      where,
      include: {
        coach: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            imageUrl: true,
          },
        },
        _count: {
          select: {
            modules: true,
          },
        },
      },
      orderBy: [
        { featured: "desc" },
        { publishedAt: "desc" },
      ],
    });

    return courses;
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
}

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const params = await searchParams;
  const courses = await getCourses(params.discipline, params.language, params.search);

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">All Courses</h1>
          <p className="mt-2 text-muted-foreground">
            Browse our complete library of martial arts courses
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex gap-2">
            <Suspense fallback={null}>
              <DisciplineFilter />
            </Suspense>
            <Suspense fallback={null}>
              <LanguageFilter />
            </Suspense>
          </div>

          <div className="relative flex-1 max-w-sm ml-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <form>
              <Input
                name="search"
                placeholder="Search courses..."
                defaultValue={params.search || ""}
                className="pl-10"
              />
            </form>
          </div>
        </div>

        {/* Results */}
        {courses.length === 0 ? (
          <Card className="p-12 text-center">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No courses yet</h3>
            <p className="text-muted-foreground mt-2">
              Courses will appear here once coaches start publishing content.
            </p>
          </Card>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-6">
              {courses.length} course{courses.length !== 1 ? "s" : ""} found
            </p>
            <CourseGrid courses={courses} />
          </>
        )}
      </div>
    </div>
  );
}
