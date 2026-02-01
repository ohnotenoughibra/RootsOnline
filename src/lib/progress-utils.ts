import type { LessonProgress } from "@prisma/client";

/**
 * Calculates the completion percentage for a course
 */
export function calculateCourseProgress(
  completedLessons: number,
  totalLessons: number
): number {
  if (totalLessons === 0) {
    return 0;
  }
  return Math.round((completedLessons / totalLessons) * 100);
}

/**
 * Counts completed lessons from progress records
 */
export function countCompletedLessons(progress: Pick<LessonProgress, "completed">[]): number {
  return progress.filter((p) => p.completed).length;
}

/**
 * Determines if a lesson should be marked as complete based on watch progress
 * Typically 90% of video watched = completed
 */
export function shouldMarkAsComplete(
  watchedSeconds: number,
  totalDuration: number,
  threshold = 0.9
): boolean {
  if (totalDuration <= 0) {
    return false;
  }
  return watchedSeconds / totalDuration >= threshold;
}

/**
 * Calculates total watch time from progress records
 */
export function calculateTotalWatchTime(
  progress: Pick<LessonProgress, "watchedSeconds">[]
): number {
  return progress.reduce((total, p) => total + (p.watchedSeconds || 0), 0);
}

/**
 * Formats watch time in a human-readable format
 */
export function formatWatchTime(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
}

/**
 * Extracts lesson IDs from nested course structure
 */
export function extractLessonIds(
  modules: Array<{ lessons: Array<{ id: string }> }>
): string[] {
  return modules.flatMap((m) => m.lessons.map((l) => l.id));
}

/**
 * Determines the next lesson to watch based on progress
 */
export function findNextLesson(
  lessonIds: string[],
  completedLessonIds: Set<string>
): string | null {
  for (const lessonId of lessonIds) {
    if (!completedLessonIds.has(lessonId)) {
      return lessonId;
    }
  }
  return null; // All lessons completed
}
