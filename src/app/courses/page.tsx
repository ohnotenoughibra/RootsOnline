import { Suspense } from "react";
import { Search } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { CourseGrid } from "@/components/course/course-grid";
import { DisciplineFilter } from "@/components/course/discipline-filter";
import { Input } from "@/components/ui/input";
import type { Discipline } from "@/types";

interface CoursesPageProps {
  searchParams: Promise<{
    discipline?: string;
    search?: string;
  }>;
}

async function getCourses(discipline?: string, search?: string) {
  const where: {
    status: "PUBLISHED";
    discipline?: Discipline;
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
}

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const params = await searchParams;
  const courses = await getCourses(params.discipline, params.search);

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
          <Suspense fallback={null}>
            <DisciplineFilter />
          </Suspense>

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

        {/* Results count */}
        <p className="text-sm text-muted-foreground mb-6">
          {courses.length} course{courses.length !== 1 ? "s" : ""} found
        </p>

        {/* Course Grid */}
        <CourseGrid courses={courses} />
      </div>
    </div>
  );
}
