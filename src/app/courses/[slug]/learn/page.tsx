"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { UniversalVideoPlayer } from "@/components/video/universal-video-player";
import { LockedVideo } from "@/components/video/locked-video";
import { CourseCurriculum } from "@/components/course/course-curriculum";
import { useUserStore } from "@/store/user-store";
import type { CourseWithModules, Lesson } from "@/types";

export default function LearnPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  // Subscribe to user state to trigger re-render when user data loads
  const { user, isLoading: userLoading } = useUserStore();

  // Compute subscription status directly from user object for reactivity
  const isSubscribed = Boolean(
    user && (
      user.role === "COACH" ||
      user.role === "ADMIN" ||
      user.subscriptionStatus === "ACTIVE" ||
      user.subscriptionStatus === "TRIALING"
    )
  );

  const [course, setCourse] = useState<CourseWithModules | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [videoLoading, setVideoLoading] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [hasPurchased, setHasPurchased] = useState(false);

  const slug = params.slug as string;
  const lessonId = searchParams.get("lesson");

  // Fetch course data and check purchase status
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/courses/${slug}`);
        if (!response.ok) throw new Error("Course not found");
        const data = await response.json();
        setCourse(data.course);

        // Set initial lesson
        const initialLesson = lessonId
          ? data.course.modules
              .flatMap((m: { lessons: Lesson[] }) => m.lessons)
              .find((l: Lesson) => l.id === lessonId)
          : data.course.modules[0]?.lessons[0];

        if (initialLesson) {
          setCurrentLesson(initialLesson);
        }

        // Check if user has purchased this course
        const purchaseResponse = await fetch(`/api/courses/${slug}/purchase`);
        if (purchaseResponse.ok) {
          const purchaseData = await purchaseResponse.json();
          setHasPurchased(purchaseData.purchased);
        }
      } catch (error) {
        console.error("Error fetching course:", error);
        router.push("/courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [slug, lessonId, router]);

  // Set video URL and fetch progress when lesson changes
  useEffect(() => {
    if (currentLesson) {
      setVideoUrl(currentLesson.videoUrl || null);

      // Fetch saved progress to resume from last position
      const fetchProgress = async () => {
        try {
          const response = await fetch(`/api/progress/lesson?lessonId=${currentLesson.id}`);
          if (response.ok) {
            const data = await response.json();
            // Resume from saved position if not completed (leave some buffer)
            if (data.watchedSeconds && !data.completed && data.watchedSeconds > 5) {
              setStartTime(data.watchedSeconds - 5); // Go back 5 seconds for context
            } else {
              setStartTime(0);
            }
          }
        } catch {
          // Silently fail - just start from beginning
          setStartTime(0);
        }
      };

      if (user) {
        fetchProgress();
      }
    }
  }, [currentLesson, user]);

  const handleLessonClick = (lessonId: string) => {
    if (!course) return;

    const lesson = course.modules
      .flatMap((m) => m.lessons)
      .find((l) => l.id === lessonId);

    if (lesson) {
      setCurrentLesson(lesson);
      router.push(`/courses/${slug}/learn?lesson=${lessonId}`, {
        scroll: false,
      });
    }
  };

  const handleProgress = async (seconds: number) => {
    if (!currentLesson) return;

    // Save progress to database
    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: currentLesson.id,
          watchedSeconds: seconds,
        }),
      });
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };

  const handleComplete = async () => {
    if (!currentLesson) return;

    // Mark lesson as complete
    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: currentLesson.id,
          completed: true,
        }),
      });
    } catch (error) {
      console.error("Error marking complete:", error);
    }
  };

  // User has access via subscription or course purchase
  const hasAccess = isSubscribed || hasPurchased;

  const handleNextLesson = () => {
    if (!course || !currentLesson) return;

    const allLessons = course.modules.flatMap((m) => m.lessons);
    const currentIndex = allLessons.findIndex((l) => l.id === currentLesson.id);
    const nextLesson = allLessons[currentIndex + 1];

    if (nextLesson) {
      const isNextAccessible = nextLesson.isFreePreview || hasAccess;
      if (isNextAccessible) {
        handleLessonClick(nextLesson.id);
      }
    }
  };

  // Check if there's a next lesson
  const hasNextLesson = () => {
    if (!course || !currentLesson) return false;
    const allLessons = course.modules.flatMap((m) => m.lessons);
    const currentIndex = allLessons.findIndex((l) => l.id === currentLesson.id);
    const nextLesson = allLessons[currentIndex + 1];
    return nextLesson && (nextLesson.isFreePreview || hasAccess);
  };

  if (loading || userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!course) {
    return null;
  }

  // User can watch if: free preview OR has subscription OR purchased this course
  const canWatch = currentLesson?.isFreePreview || hasAccess;

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="border-b bg-card">
        <div className="flex items-center gap-4 px-4 py-3">
          <Link href={`/courses/${slug}`}>
            <Button variant="ghost" size="sm">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Course
            </Button>
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="font-semibold truncate">{course.title}</h1>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Video area */}
        <div className="flex-1 p-4 lg:p-6">
          {videoLoading ? (
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : canWatch && videoUrl ? (
            <UniversalVideoPlayer
              src={videoUrl}
              title={currentLesson?.title}
              lessonId={currentLesson?.id}
              startTime={startTime}
              onProgress={handleProgress}
              onComplete={handleComplete}
              onNextLesson={hasNextLesson() ? handleNextLesson : undefined}
            />
          ) : (
            <LockedVideo />
          )}

          {/* Lesson info */}
          {currentLesson && (
            <div className="mt-6">
              <h2 className="text-2xl font-bold">{currentLesson.title}</h2>
              {currentLesson.description && (
                <p className="mt-2 text-muted-foreground">
                  {currentLesson.description}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Sidebar - Curriculum */}
        <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l bg-card">
          <div className="p-4 border-b">
            <h3 className="font-semibold">Course Content</h3>
          </div>
          <div className="p-4 overflow-y-auto max-h-[calc(100vh-16rem)]">
            <CourseCurriculum
              modules={course.modules}
              isSubscribed={hasAccess}
              onLessonClick={handleLessonClick}
              currentLessonId={currentLesson?.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
