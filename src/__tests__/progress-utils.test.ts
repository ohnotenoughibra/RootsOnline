import { describe, it, expect } from "vitest";
import {
  calculateCourseProgress,
  countCompletedLessons,
  shouldMarkAsComplete,
  calculateTotalWatchTime,
  formatWatchTime,
  extractLessonIds,
  findNextLesson,
} from "@/lib/progress-utils";

describe("calculateCourseProgress", () => {
  it("returns 0 when no lessons exist", () => {
    expect(calculateCourseProgress(0, 0)).toBe(0);
  });

  it("returns 0 when no lessons are completed", () => {
    expect(calculateCourseProgress(0, 10)).toBe(0);
  });

  it("returns 100 when all lessons are completed", () => {
    expect(calculateCourseProgress(10, 10)).toBe(100);
  });

  it("calculates percentage correctly", () => {
    expect(calculateCourseProgress(5, 10)).toBe(50);
    expect(calculateCourseProgress(3, 10)).toBe(30);
    expect(calculateCourseProgress(7, 10)).toBe(70);
  });

  it("rounds to nearest integer", () => {
    expect(calculateCourseProgress(1, 3)).toBe(33);
    expect(calculateCourseProgress(2, 3)).toBe(67);
  });
});

describe("countCompletedLessons", () => {
  it("returns 0 for empty array", () => {
    expect(countCompletedLessons([])).toBe(0);
  });

  it("counts only completed lessons", () => {
    const progress = [
      { completed: true },
      { completed: false },
      { completed: true },
      { completed: false },
    ];
    expect(countCompletedLessons(progress)).toBe(2);
  });

  it("returns 0 when none are completed", () => {
    const progress = [
      { completed: false },
      { completed: false },
    ];
    expect(countCompletedLessons(progress)).toBe(0);
  });
});

describe("shouldMarkAsComplete", () => {
  it("returns false for zero duration", () => {
    expect(shouldMarkAsComplete(100, 0)).toBe(false);
  });

  it("returns false for negative duration", () => {
    expect(shouldMarkAsComplete(100, -10)).toBe(false);
  });

  it("returns true when watched 90% or more (default threshold)", () => {
    expect(shouldMarkAsComplete(90, 100)).toBe(true);
    expect(shouldMarkAsComplete(95, 100)).toBe(true);
    expect(shouldMarkAsComplete(100, 100)).toBe(true);
  });

  it("returns false when watched less than 90%", () => {
    expect(shouldMarkAsComplete(89, 100)).toBe(false);
    expect(shouldMarkAsComplete(50, 100)).toBe(false);
  });

  it("supports custom threshold", () => {
    expect(shouldMarkAsComplete(80, 100, 0.8)).toBe(true);
    expect(shouldMarkAsComplete(79, 100, 0.8)).toBe(false);
    expect(shouldMarkAsComplete(50, 100, 0.5)).toBe(true);
  });
});

describe("calculateTotalWatchTime", () => {
  it("returns 0 for empty array", () => {
    expect(calculateTotalWatchTime([])).toBe(0);
  });

  it("sums all watch times", () => {
    const progress = [
      { watchedSeconds: 100 },
      { watchedSeconds: 200 },
      { watchedSeconds: 150 },
    ];
    expect(calculateTotalWatchTime(progress)).toBe(450);
  });

  it("handles null/undefined watchedSeconds", () => {
    const progress = [
      { watchedSeconds: 100 },
      { watchedSeconds: null as unknown as number },
      { watchedSeconds: 50 },
    ];
    expect(calculateTotalWatchTime(progress)).toBe(150);
  });
});

describe("formatWatchTime", () => {
  it("formats seconds under 1 minute", () => {
    expect(formatWatchTime(30)).toBe("30s");
    expect(formatWatchTime(59)).toBe("59s");
  });

  it("formats minutes", () => {
    expect(formatWatchTime(60)).toBe("1m");
    expect(formatWatchTime(120)).toBe("2m");
    expect(formatWatchTime(3599)).toBe("59m");
  });

  it("formats hours and minutes", () => {
    expect(formatWatchTime(3600)).toBe("1h 0m");
    expect(formatWatchTime(3660)).toBe("1h 1m");
    expect(formatWatchTime(7200)).toBe("2h 0m");
    expect(formatWatchTime(7380)).toBe("2h 3m");
  });
});

describe("extractLessonIds", () => {
  it("returns empty array for empty modules", () => {
    expect(extractLessonIds([])).toEqual([]);
  });

  it("extracts lesson IDs from nested structure", () => {
    const modules = [
      { lessons: [{ id: "l1" }, { id: "l2" }] },
      { lessons: [{ id: "l3" }] },
    ];
    expect(extractLessonIds(modules)).toEqual(["l1", "l2", "l3"]);
  });

  it("handles modules with no lessons", () => {
    const modules = [
      { lessons: [{ id: "l1" }] },
      { lessons: [] },
      { lessons: [{ id: "l2" }] },
    ];
    expect(extractLessonIds(modules)).toEqual(["l1", "l2"]);
  });
});

describe("findNextLesson", () => {
  it("returns null for empty lesson list", () => {
    expect(findNextLesson([], new Set())).toBeNull();
  });

  it("returns first lesson when none completed", () => {
    const lessonIds = ["l1", "l2", "l3"];
    expect(findNextLesson(lessonIds, new Set())).toBe("l1");
  });

  it("returns next uncompleted lesson", () => {
    const lessonIds = ["l1", "l2", "l3"];
    expect(findNextLesson(lessonIds, new Set(["l1"]))).toBe("l2");
    expect(findNextLesson(lessonIds, new Set(["l1", "l2"]))).toBe("l3");
  });

  it("returns null when all lessons completed", () => {
    const lessonIds = ["l1", "l2", "l3"];
    expect(findNextLesson(lessonIds, new Set(["l1", "l2", "l3"]))).toBeNull();
  });

  it("skips non-sequential completions", () => {
    const lessonIds = ["l1", "l2", "l3", "l4"];
    // User completed l1 and l3, next should be l2
    expect(findNextLesson(lessonIds, new Set(["l1", "l3"]))).toBe("l2");
  });
});
