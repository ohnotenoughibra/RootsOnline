import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { GraduationCap, Clock, BookOpen, ArrowRight } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getDisciplineLabel } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Learning Paths",
  description:
    "Follow curated learning paths to master MMA, Kickboxing, or Grappling. Structured courses from beginner to advanced.",
  openGraph: {
    title: "Learning Paths | ROA",
    description: "Structured learning paths for martial arts mastery",
    url: `${siteConfig.url}/learning-paths`,
  },
};

async function getLearningPaths() {
  const paths = await prisma.learningPath.findMany({
    where: { isPublished: true },
    include: {
      items: {
        include: {
          course: {
            select: {
              id: true,
              title: true,
              coverImage: true,
            },
          },
        },
        orderBy: { order: "asc" },
      },
      _count: {
        select: { enrollments: true },
      },
    },
    orderBy: [{ discipline: "asc" }, { createdAt: "desc" }],
  });

  return paths;
}

export default async function LearningPathsPage() {
  const paths = await getLearningPaths();

  // Group by discipline
  const pathsByDiscipline = paths.reduce((acc, path) => {
    const discipline = path.discipline;
    if (!acc[discipline]) acc[discipline] = [];
    acc[discipline].push(path);
    return acc;
  }, {} as Record<string, typeof paths>);

  return (
    <div className="flex flex-col">
      {/* Hero Section - Minimal */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Learning Paths
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Follow curated paths designed by our coaches. Progress from
            fundamentals to advanced techniques.
          </p>
        </div>
      </section>

      {/* Paths Section */}
      <section className="py-12 border-t">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {Object.keys(pathsByDiscipline).length === 0 ? (
            <div className="py-20 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 mb-6">
                <GraduationCap className="h-7 w-7 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">Coming Soon</h3>
              <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                Learning paths are being created by our coaches. Check back soon!
              </p>
              <Link href="/courses" className="inline-block mt-6">
                <Button>
                  Browse Courses
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-16">
              {Object.entries(pathsByDiscipline).map(([discipline, disciplinePaths]) => (
                <div key={discipline}>
                  <h2 className="text-2xl font-bold mb-8">
                    {getDisciplineLabel(discipline)}
                  </h2>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {disciplinePaths.map((path) => (
                      <div key={path.id} className="border-2 rounded-lg overflow-hidden">
                        {/* Cover */}
                        <div className="h-32 bg-muted relative">
                          {path.coverImage ? (
                            <Image
                              src={path.coverImage}
                              alt={path.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <GraduationCap className="h-12 w-12 text-muted-foreground/30" />
                            </div>
                          )}
                          <div className="absolute top-3 left-3">
                            <Badge variant="outline" className="bg-background">
                              {path.difficulty}
                            </Badge>
                          </div>
                        </div>

                        <div className="p-5">
                          <h3 className="font-semibold line-clamp-1">
                            {path.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                            {path.description}
                          </p>

                          {/* Stats */}
                          <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <BookOpen className="h-4 w-4" />
                              {path.items.length} courses
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              ~{path.estimatedWeeks} weeks
                            </span>
                          </div>

                          <Link href={`/learning-paths/${path.slug}`} className="block mt-4">
                            <Button className="w-full" variant="outline" size="sm">
                              View Path
                              <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
