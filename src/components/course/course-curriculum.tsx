"use client";

import { useState } from "react";
import { Lock, Play, CheckCircle2, Clock } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { cn, formatDuration } from "@/lib/utils";
import type { ModuleWithLessons, ModuleWithLessonsAndProgress } from "@/types";

interface CourseCurriculumProps {
  modules: ModuleWithLessons[] | ModuleWithLessonsAndProgress[];
  isSubscribed: boolean;
  onLessonClick?: (lessonId: string) => void;
  currentLessonId?: string;
}

export function CourseCurriculum({
  modules,
  isSubscribed,
  onLessonClick,
  currentLessonId,
}: CourseCurriculumProps) {
  const [openModules, setOpenModules] = useState<string[]>(
    modules.length > 0 ? [modules[0].id] : []
  );

  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const totalDuration = modules.reduce(
    (acc, m) =>
      acc + m.lessons.reduce((a, l) => a + (l.videoDuration || 0), 0),
    0
  );

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>{modules.length} modules</span>
        <span>{totalLessons} lessons</span>
        {totalDuration > 0 && <span>{formatDuration(totalDuration)} total</span>}
      </div>

      {/* Modules */}
      <Accordion
        type="multiple"
        value={openModules}
        onValueChange={setOpenModules}
        className="space-y-2"
      >
        {modules.map((module, moduleIndex) => (
          <AccordionItem
            key={module.id}
            value={module.id}
            className="border rounded-lg px-4"
          >
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-3 text-left">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium">
                  {moduleIndex + 1}
                </span>
                <div>
                  <h4 className="font-medium">{module.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {module.lessons.length} lessons
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <div className="space-y-1 pt-2">
                {module.lessons.map((lesson, lessonIndex) => {
                  const hasProgress = "progress" in lesson;
                  const isCompleted = hasProgress && lesson.progress?.completed;
                  const isLocked = !isSubscribed && !lesson.isFreePreview;
                  const isCurrent = currentLessonId === lesson.id;

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => !isLocked && onLessonClick?.(lesson.id)}
                      disabled={isLocked}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors",
                        isLocked
                          ? "cursor-not-allowed opacity-60"
                          : "hover:bg-muted cursor-pointer",
                        isCurrent && "bg-primary/10"
                      )}
                    >
                      {/* Icon */}
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center">
                        {isLocked ? (
                          <Lock className="h-4 w-4 text-muted-foreground" />
                        ) : isCompleted ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <Play className="h-4 w-4 text-primary" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium truncate">
                            {lessonIndex + 1}. {lesson.title}
                          </span>
                          {lesson.isFreePreview && (
                            <Badge variant="secondary" className="shrink-0 text-xs">
                              Free
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Duration */}
                      {lesson.videoDuration && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                          <Clock className="h-3 w-3" />
                          <span>{formatDuration(lesson.videoDuration)}</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
