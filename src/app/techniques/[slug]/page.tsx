"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  Tag,
  PlayCircle,
  Clock,
  Lock,
  Eye,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useUserStore } from "@/store/user-store";

interface TechniqueLesson {
  id: string;
  lesson: {
    id: string;
    title: string;
    description?: string;
    videoDuration?: number;
    isFreePreview: boolean;
    module: {
      title: string;
      course: {
        id: string;
        slug: string;
        title: string;
        discipline: string;
      };
    };
  };
}

interface Technique {
  id: string;
  name: string;
  slug: string;
  discipline: string;
  description?: string;
  lessons: TechniqueLesson[];
}

const disciplineLabels: Record<string, string> = {
  MMA: "MMA",
  KICKBOXING: "Kickboxing",
  GRAPPLING: "Grappling",
};

function formatDuration(seconds?: number): string {
  if (!seconds) return "";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function TechniquePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { user } = useUserStore();

  const [technique, setTechnique] = useState<Technique | null>(null);
  const [loading, setLoading] = useState(true);

  const isSubscribed = Boolean(
    user &&
      (user.role === "ADMIN" ||
        user.role === "COACH" ||
        user.subscriptionStatus === "ACTIVE" ||
        user.subscriptionStatus === "TRIALING")
  );

  useEffect(() => {
    fetchTechnique();
  }, [slug]);

  const fetchTechnique = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/techniques/${slug}`);
      if (!response.ok) {
        if (response.status === 404) {
          router.push("/techniques");
          return;
        }
        throw new Error("Failed to fetch technique");
      }
      const data = await response.json();
      setTechnique(data.technique);
    } catch (error) {
      console.error("Error fetching technique:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!technique) {
    return null;
  }

  // Group lessons by course
  const lessonsByCourse = technique.lessons.reduce<
    Record<string, { course: TechniqueLesson["lesson"]["module"]["course"]; lessons: TechniqueLesson[] }>
  >((acc, item) => {
    const courseId = item.lesson.module.course.id;
    if (!acc[courseId]) {
      acc[courseId] = {
        course: item.lesson.module.course,
        lessons: [],
      };
    }
    acc[courseId].lessons.push(item);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <Link
            href="/techniques"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Technique Library
          </Link>

          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-lg bg-primary/10 flex items-center justify-center">
              <Tag className="h-7 w-7 text-primary" />
            </div>
            <div>
              <Badge variant="secondary" className="mb-2">
                {disciplineLabels[technique.discipline] || technique.discipline}
              </Badge>
              <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
                {technique.name}
              </h1>
              {technique.description && (
                <p className="mt-3 text-lg text-muted-foreground max-w-3xl">
                  {technique.description}
                </p>
              )}
              <div className="flex items-center gap-2 mt-4">
                <PlayCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {technique.lessons.length} lessons cover this technique
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lessons */}
      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {technique.lessons.length === 0 ? (
            <div className="text-center py-16">
              <PlayCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold">No lessons yet</h2>
              <p className="text-muted-foreground mt-2">
                Lessons covering this technique will be added soon
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {Object.values(lessonsByCourse).map(({ course, lessons }) => (
                <div key={course.id}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-semibold">{course.title}</h2>
                      <p className="text-sm text-muted-foreground">
                        {lessons.length} lesson{lessons.length !== 1 ? "s" : ""} in this course
                      </p>
                    </div>
                    <Link href={`/courses/${course.slug}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Course
                      </Button>
                    </Link>
                  </div>

                  <div className="space-y-3">
                    {lessons.map((item) => {
                      const lesson = item.lesson;
                      const canAccess = lesson.isFreePreview || isSubscribed;

                      return (
                        <Card key={item.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                                {canAccess ? (
                                  <PlayCircle className="h-5 w-5 text-primary" />
                                ) : (
                                  <Lock className="h-5 w-5 text-muted-foreground" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium truncate">
                                    {lesson.title}
                                  </h3>
                                  {lesson.isFreePreview && (
                                    <Badge variant="secondary" className="text-xs">
                                      Free
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {lesson.module.title}
                                </p>
                              </div>
                              {lesson.videoDuration && (
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Clock className="h-4 w-4" />
                                  {formatDuration(lesson.videoDuration)}
                                </div>
                              )}
                              <Link
                                href={
                                  canAccess
                                    ? `/courses/${course.slug}/learn?lesson=${lesson.id}`
                                    : `/courses/${course.slug}`
                                }
                              >
                                <Button
                                  variant={canAccess ? "default" : "outline"}
                                  size="sm"
                                >
                                  {canAccess ? "Watch" : "Subscribe"}
                                </Button>
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
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
