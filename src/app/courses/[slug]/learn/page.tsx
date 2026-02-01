"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, Loader2, HelpCircle, CheckCircle } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MultiAnglePlayer } from "@/components/video/multi-angle-player";
import { LockedVideo } from "@/components/video/locked-video";
import { CourseCurriculum } from "@/components/course/course-curriculum";
import { QuizTaker } from "@/components/quiz/quiz-taker";
import { DiscussionSection } from "@/components/discussion/discussion-section";
import { useUserStore } from "@/store/user-store";
import type { CourseWithModules, Lesson } from "@/types";

interface LessonQuiz {
  id: string;
  title: string;
  description?: string;
  passingScore: number;
  questionCount: number;
  bestScore?: number;
  hasPassed?: boolean;
}

export default function LearnPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  // Subscribe to user state to trigger re-render when user data loads
  const { user, isLoading: userLoading } = useUserStore();

  const [course, setCourse] = useState<CourseWithModules | null>(null);

  // Compute subscription status directly from user object for reactivity
  // Also check if user is the course owner
  const isCourseOwner = Boolean(
    user && course?.coach?.id && user.id === course.coach.id
  );

  const isSubscribed = Boolean(
    user && (
      user.role === "ADMIN" ||
      user.role === "COACH" ||
      isCourseOwner ||
      user.subscriptionStatus === "ACTIVE" ||
      user.subscriptionStatus === "TRIALING"
    )
  );
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [videoLoading, setVideoLoading] = useState(false);
  const [lessonQuizzes, setLessonQuizzes] = useState<LessonQuiz[]>([]);
  const [activeQuiz, setActiveQuiz] = useState<string | null>(null);

  const slug = params.slug as string;
  const lessonId = searchParams.get("lesson");

  // Fetch course data
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
      } catch (error) {
        console.error("Error fetching course:", error);
        router.push("/courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [slug, lessonId, router]);

  // Set video URL when lesson changes - use direct URL from Cloudinary
  useEffect(() => {
    if (currentLesson) {
      setVideoUrl(currentLesson.videoUrl || null);
    }
  }, [currentLesson]);

  // Fetch quizzes for the current lesson
  useEffect(() => {
    const fetchQuizzes = async () => {
      if (!currentLesson || !isSubscribed) {
        setLessonQuizzes([]);
        return;
      }

      try {
        const response = await fetch(`/api/lessons/${currentLesson.id}/quizzes`);
        if (response.ok) {
          const data = await response.json();
          setLessonQuizzes(data.quizzes);
        }
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };

    fetchQuizzes();
    setActiveQuiz(null);
  }, [currentLesson, isSubscribed]);

  const handleQuizComplete = (passed: boolean, score: number) => {
    // Refresh quizzes to update best score
    if (currentLesson) {
      fetch(`/api/lessons/${currentLesson.id}/quizzes`)
        .then((res) => res.json())
        .then((data) => setLessonQuizzes(data.quizzes))
        .catch(console.error);
    }
  };

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

  const handleNextLesson = () => {
    if (!course || !currentLesson) return;

    const allLessons = course.modules.flatMap((m) => m.lessons);
    const currentIndex = allLessons.findIndex((l) => l.id === currentLesson.id);
    const nextLesson = allLessons[currentIndex + 1];

    if (nextLesson) {
      const isNextAccessible = nextLesson.isFreePreview || isSubscribed;
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
    return nextLesson && (nextLesson.isFreePreview || isSubscribed);
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

  const canWatch = currentLesson?.isFreePreview || isSubscribed;

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
          ) : canWatch && currentLesson ? (
            <MultiAnglePlayer
              lessonId={currentLesson.id}
              defaultVideoUrl={videoUrl || undefined}
              title={currentLesson.title}
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

          {/* Quiz Section */}
          {canWatch && lessonQuizzes.length > 0 && (
            <div className="mt-8">
              {activeQuiz ? (
                <div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveQuiz(null)}
                    className="mb-4"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Back to Lesson
                  </Button>
                  <QuizTaker
                    quizId={activeQuiz}
                    onComplete={handleQuizComplete}
                  />
                </div>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <HelpCircle className="h-5 w-5" />
                      Knowledge Check
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {lessonQuizzes.map((quiz) => (
                      <div
                        key={quiz.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {quiz.hasPassed ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <HelpCircle className="h-5 w-5 text-muted-foreground" />
                          )}
                          <div>
                            <h4 className="font-medium">{quiz.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {quiz.questionCount} questions • Pass: {quiz.passingScore}%
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {quiz.bestScore !== undefined && (
                            <Badge variant={quiz.hasPassed ? "default" : "secondary"}>
                              Best: {quiz.bestScore}%
                            </Badge>
                          )}
                          <Button
                            size="sm"
                            onClick={() => setActiveQuiz(quiz.id)}
                          >
                            {quiz.hasPassed ? "Retake" : "Start"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Discussion Section */}
          {canWatch && currentLesson && (
            <div className="mt-8">
              <DiscussionSection
                courseId={course.id}
                lessonId={currentLesson.id}
              />
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
              isSubscribed={isSubscribed}
              onLessonClick={handleLessonClick}
              currentLessonId={currentLesson?.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
