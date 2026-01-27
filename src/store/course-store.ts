import { create } from "zustand";
import type { CourseWithModules, Discipline } from "@/types";

interface CourseState {
  // Current course being viewed/edited
  currentCourse: CourseWithModules | null;
  setCurrentCourse: (course: CourseWithModules | null) => void;

  // Filters for course listing
  filters: {
    discipline: Discipline | null;
    search: string;
  };
  setDisciplineFilter: (discipline: Discipline | null) => void;
  setSearchFilter: (search: string) => void;
  clearFilters: () => void;

  // Video player state
  currentLessonId: string | null;
  setCurrentLessonId: (lessonId: string | null) => void;
}

export const useCourseStore = create<CourseState>((set) => ({
  currentCourse: null,
  setCurrentCourse: (course) => set({ currentCourse: course }),

  filters: {
    discipline: null,
    search: "",
  },
  setDisciplineFilter: (discipline) =>
    set((state) => ({
      filters: { ...state.filters, discipline },
    })),
  setSearchFilter: (search) =>
    set((state) => ({
      filters: { ...state.filters, search },
    })),
  clearFilters: () =>
    set({
      filters: { discipline: null, search: "" },
    }),

  currentLessonId: null,
  setCurrentLessonId: (lessonId) => set({ currentLessonId: lessonId }),
}));
