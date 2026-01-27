import type {
  User,
  Course,
  Module,
  Lesson,
  LessonProgress,
  Role,
  Discipline,
  CourseStatus,
  SubscriptionStatus,
} from "@prisma/client";

// Re-export Prisma types
export type {
  User,
  Course,
  Module,
  Lesson,
  LessonProgress,
  Role,
  Discipline,
  CourseStatus,
  SubscriptionStatus,
};

// Extended types with relations
export type CourseWithCoach = Course & {
  coach: Pick<User, "id" | "firstName" | "lastName" | "imageUrl">;
};

export type CourseWithModules = Course & {
  modules: ModuleWithLessons[];
  coach: Pick<User, "id" | "firstName" | "lastName" | "imageUrl">;
};

export type ModuleWithLessons = Module & {
  lessons: Lesson[];
};

export type LessonWithProgress = Lesson & {
  progress: LessonProgress | null;
};

export type ModuleWithLessonsAndProgress = Module & {
  lessons: LessonWithProgress[];
};

export type CourseWithProgress = Course & {
  modules: ModuleWithLessonsAndProgress[];
  coach: Pick<User, "id" | "firstName" | "lastName" | "imageUrl">;
  _count?: {
    lessons: number;
    completedLessons: number;
  };
};

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Subscription types
export interface SubscriptionPlan {
  name: string;
  price: number;
  priceId: string;
  interval: "month" | "year";
  description: string;
  savings?: number;
}

// Video upload types
export interface VideoUploadResult {
  publicId: string;
  url: string;
  secureUrl: string;
  duration: number;
  format: string;
  width: number;
  height: number;
}

// Course form types
export interface CourseFormData {
  title: string;
  description: string;
  shortDescription?: string;
  discipline: Discipline;
  coverImage?: string;
  previewVideoUrl?: string;
}

export interface ModuleFormData {
  title: string;
  description?: string;
}

export interface LessonFormData {
  title: string;
  description?: string;
  videoUrl?: string;
  videoPublicId?: string;
  videoDuration?: number;
  isFreePreview?: boolean;
}

// Search/filter types
export interface CourseFilters {
  discipline?: Discipline;
  search?: string;
  status?: CourseStatus;
  coachId?: string;
}

// Navigation types
export interface NavItem {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}
