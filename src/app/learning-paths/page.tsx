import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { GraduationCap, Clock, BookOpen, ChevronRight } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
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

const difficultyColors = {
  BEGINNER: "bg-green-100 text-green-700",
  INTERMEDIATE: "bg-yellow-100 text-yellow-700",
  ADVANCED: "bg-red-100 text-red-700",
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
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4" variant="secondary">
            <GraduationCap className="h-3 w-3 mr-1" />
            Structured Learning
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Learning Paths
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Follow curated paths designed by our expert coaches. Each path
            takes you from fundamentals to advanced techniques in a logical
            progression.
          </p>
        </div>

        {/* Paths by Discipline */}
        {Object.keys(pathsByDiscipline).length === 0 ? (
          <Card className="p-12 text-center">
            <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">Coming Soon</h3>
            <p className="text-muted-foreground mt-2">
              Learning paths are being created by our coaches. Check back soon!
            </p>
            <Link href="/courses" className="inline-block mt-4">
              <Button>Browse Courses</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-12">
            {Object.entries(pathsByDiscipline).map(([discipline, disciplinePaths]) => (
              <section key={discipline}>
                <h2 className="text-2xl font-bold mb-6">
                  {getDisciplineLabel(discipline)} Paths
                </h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {disciplinePaths.map((path) => (
                    <Card key={path.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      {/* Cover Image */}
                      <div className="h-40 bg-gradient-to-br from-primary/20 to-primary/5 relative">
                        {path.coverImage ? (
                          <Image
                            src={path.coverImage}
                            alt={path.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <GraduationCap className="h-16 w-16 text-primary/30" />
                          </div>
                        )}
                        <div className="absolute top-3 left-3 flex gap-2">
                          <Badge
                            variant={
                              discipline.toLowerCase() as
                                | "mma"
                                | "kickboxing"
                                | "grappling"
                            }
                          >
                            {getDisciplineLabel(discipline)}
                          </Badge>
                          <Badge
                            className={
                              difficultyColors[
                                path.difficulty as keyof typeof difficultyColors
                              ] || difficultyColors.BEGINNER
                            }
                          >
                            {path.difficulty}
                          </Badge>
                        </div>
                      </div>

                      <CardContent className="p-5">
                        <h3 className="font-semibold text-lg line-clamp-1">
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

                        {/* Course preview */}
                        {path.items.length > 0 && (
                          <div className="mt-4 flex -space-x-2">
                            {path.items.slice(0, 4).map((item, idx) => (
                              <div
                                key={item.id}
                                className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium"
                                title={item.course.title}
                              >
                                {idx + 1}
                              </div>
                            ))}
                            {path.items.length > 4 && (
                              <div className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium">
                                +{path.items.length - 4}
                              </div>
                            )}
                          </div>
                        )}

                        <Link href={`/learning-paths/${path.slug}`} className="block mt-4">
                          <Button className="w-full" size="sm">
                            View Path
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
