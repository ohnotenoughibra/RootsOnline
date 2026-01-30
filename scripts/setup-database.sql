-- ROA (Roots Online Academy) Database Setup Script
-- Run this SQL in your Neon dashboard to set up the database tables
-- Compatible with PostgreSQL / Neon

-- =====================
-- ENUMS
-- =====================

-- User roles
DO $$ BEGIN
    CREATE TYPE "Role" AS ENUM ('STUDENT', 'COACH', 'ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Subscription status
DO $$ BEGIN
    CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'CANCELED', 'PAST_DUE', 'TRIALING', 'INACTIVE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Course disciplines/categories
DO $$ BEGIN
    CREATE TYPE "Discipline" AS ENUM ('MMA', 'KICKBOXING', 'GRAPPLING');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Course status
DO $$ BEGIN
    CREATE TYPE "CourseStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Training footage submission status
DO $$ BEGIN
    CREATE TYPE "SubmissionStatus" AS ENUM ('PENDING', 'REVIEWED', 'ARCHIVED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =====================
-- TABLES
-- =====================

-- User table - synced with Clerk
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "imageUrl" TEXT,
    "role" "Role" NOT NULL DEFAULT 'STUDENT',
    "stripeCustomerId" TEXT,
    "subscriptionStatus" "SubscriptionStatus" NOT NULL DEFAULT 'INACTIVE',
    "subscriptionId" TEXT,
    "subscriptionPriceId" TEXT,
    "subscriptionEndsAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- Course table - created by coaches
CREATE TABLE IF NOT EXISTS "Course" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "shortDescription" VARCHAR(300),
    "coverImage" TEXT,
    "previewVideoUrl" TEXT,
    "discipline" "Discipline" NOT NULL,
    "status" "CourseStatus" NOT NULL DEFAULT 'DRAFT',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "coachId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publishedAt" TIMESTAMP(3),

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- Module table - sections within a course
CREATE TABLE IF NOT EXISTS "Module" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "courseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);

-- Lesson table - individual videos/content
CREATE TABLE IF NOT EXISTS "Lesson" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "videoUrl" TEXT,
    "videoPublicId" TEXT,
    "videoDuration" INTEGER,
    "videoProvider" TEXT NOT NULL DEFAULT 'cloudinary',
    "isFreePreview" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "moduleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- Lesson progress tracking
CREATE TABLE IF NOT EXISTS "LessonProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "watchedSeconds" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LessonProgress_pkey" PRIMARY KEY ("id")
);

-- Training footage uploaded by members for feedback
CREATE TABLE IF NOT EXISTS "TrainingFootage" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "videoUrl" TEXT NOT NULL,
    "videoPublicId" TEXT,
    "videoDuration" INTEGER,
    "thumbnailUrl" TEXT,
    "discipline" "Discipline" NOT NULL,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'PENDING',
    "memberId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrainingFootage_pkey" PRIMARY KEY ("id")
);

-- Coach feedback on training footage
CREATE TABLE IF NOT EXISTS "VideoFeedback" (
    "id" TEXT NOT NULL,
    "footageId" TEXT NOT NULL,
    "coachId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "videoUrl" TEXT,
    "videoPublicId" TEXT,
    "timestamps" TEXT,
    "rating" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VideoFeedback_pkey" PRIMARY KEY ("id")
);

-- =====================
-- UNIQUE CONSTRAINTS
-- =====================

-- User unique constraints
DO $$ BEGIN
    ALTER TABLE "User" ADD CONSTRAINT "User_clerkId_key" UNIQUE ("clerkId");
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "User" ADD CONSTRAINT "User_email_key" UNIQUE ("email");
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "User" ADD CONSTRAINT "User_stripeCustomerId_key" UNIQUE ("stripeCustomerId");
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "User" ADD CONSTRAINT "User_subscriptionId_key" UNIQUE ("subscriptionId");
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Course unique constraints
DO $$ BEGIN
    ALTER TABLE "Course" ADD CONSTRAINT "Course_slug_key" UNIQUE ("slug");
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- LessonProgress unique constraint
DO $$ BEGIN
    ALTER TABLE "LessonProgress" ADD CONSTRAINT "LessonProgress_userId_lessonId_key" UNIQUE ("userId", "lessonId");
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =====================
-- FOREIGN KEYS
-- =====================

-- Course -> User (coach)
DO $$ BEGIN
    ALTER TABLE "Course" ADD CONSTRAINT "Course_coachId_fkey"
    FOREIGN KEY ("coachId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Module -> Course
DO $$ BEGIN
    ALTER TABLE "Module" ADD CONSTRAINT "Module_courseId_fkey"
    FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Lesson -> Module
DO $$ BEGIN
    ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_moduleId_fkey"
    FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- LessonProgress -> User
DO $$ BEGIN
    ALTER TABLE "LessonProgress" ADD CONSTRAINT "LessonProgress_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- LessonProgress -> Lesson
DO $$ BEGIN
    ALTER TABLE "LessonProgress" ADD CONSTRAINT "LessonProgress_lessonId_fkey"
    FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- TrainingFootage -> User (member)
DO $$ BEGIN
    ALTER TABLE "TrainingFootage" ADD CONSTRAINT "TrainingFootage_memberId_fkey"
    FOREIGN KEY ("memberId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- VideoFeedback -> TrainingFootage
DO $$ BEGIN
    ALTER TABLE "VideoFeedback" ADD CONSTRAINT "VideoFeedback_footageId_fkey"
    FOREIGN KEY ("footageId") REFERENCES "TrainingFootage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- VideoFeedback -> User (coach)
DO $$ BEGIN
    ALTER TABLE "VideoFeedback" ADD CONSTRAINT "VideoFeedback_coachId_fkey"
    FOREIGN KEY ("coachId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =====================
-- INDEXES
-- =====================

CREATE INDEX IF NOT EXISTS "Course_discipline_idx" ON "Course"("discipline");
CREATE INDEX IF NOT EXISTS "Course_status_idx" ON "Course"("status");
CREATE INDEX IF NOT EXISTS "Course_coachId_idx" ON "Course"("coachId");
CREATE INDEX IF NOT EXISTS "Module_courseId_idx" ON "Module"("courseId");
CREATE INDEX IF NOT EXISTS "Lesson_moduleId_idx" ON "Lesson"("moduleId");
CREATE INDEX IF NOT EXISTS "LessonProgress_userId_idx" ON "LessonProgress"("userId");
CREATE INDEX IF NOT EXISTS "LessonProgress_lessonId_idx" ON "LessonProgress"("lessonId");
CREATE INDEX IF NOT EXISTS "TrainingFootage_memberId_idx" ON "TrainingFootage"("memberId");
CREATE INDEX IF NOT EXISTS "TrainingFootage_status_idx" ON "TrainingFootage"("status");
CREATE INDEX IF NOT EXISTS "TrainingFootage_discipline_idx" ON "TrainingFootage"("discipline");
CREATE INDEX IF NOT EXISTS "VideoFeedback_footageId_idx" ON "VideoFeedback"("footageId");
CREATE INDEX IF NOT EXISTS "VideoFeedback_coachId_idx" ON "VideoFeedback"("coachId");

-- =====================
-- DISABLE ROW LEVEL SECURITY
-- =====================

ALTER TABLE "User" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Course" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Module" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Lesson" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "LessonProgress" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "TrainingFootage" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "VideoFeedback" DISABLE ROW LEVEL SECURITY;

-- =====================
-- TRIGGER FOR updatedAt
-- =====================

-- Create update trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables
DO $$ BEGIN
    CREATE TRIGGER update_user_updated_at BEFORE UPDATE ON "User"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TRIGGER update_course_updated_at BEFORE UPDATE ON "Course"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TRIGGER update_module_updated_at BEFORE UPDATE ON "Module"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TRIGGER update_lesson_updated_at BEFORE UPDATE ON "Lesson"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TRIGGER update_lesson_progress_updated_at BEFORE UPDATE ON "LessonProgress"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TRIGGER update_training_footage_updated_at BEFORE UPDATE ON "TrainingFootage"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TRIGGER update_video_feedback_updated_at BEFORE UPDATE ON "VideoFeedback"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =====================
-- SUCCESS MESSAGE
-- =====================

DO $$
BEGIN
    RAISE NOTICE 'ROA Database setup completed successfully!';
    RAISE NOTICE 'Tables created: User, Course, Module, Lesson, LessonProgress, TrainingFootage, VideoFeedback';
END $$;
