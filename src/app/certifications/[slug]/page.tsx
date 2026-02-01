import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  Award,
  BookOpen,
  Clock,
  CheckCircle2,
  ArrowLeft,
  FileText,
  Video,
} from "lucide-react";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getDisciplineLabel } from "@/lib/utils";

interface CertificationPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const levelLabels: Record<string, string> = {
  LEVEL_1: "Level 1 - Foundation",
  LEVEL_2: "Level 2 - Intermediate",
  LEVEL_3: "Level 3 - Advanced",
  MASTER: "Master Instructor",
};

const statusLabels: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Pending Review", color: "bg-yellow-100 text-yellow-800" },
  IN_REVIEW: { label: "Under Review", color: "bg-blue-100 text-blue-800" },
  APPROVED: { label: "Certified", color: "bg-green-100 text-green-800" },
  REJECTED: { label: "Not Approved", color: "bg-red-100 text-red-800" },
  EXPIRED: { label: "Expired", color: "bg-gray-100 text-gray-800" },
};

export async function generateMetadata({
  params,
}: CertificationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const certification = await prisma.instructorCertification.findUnique({
    where: { slug },
    select: { title: true, description: true },
  });

  if (!certification) {
    return { title: "Certification Not Found" };
  }

  return {
    title: `${certification.title} | Instructor Certification`,
    description: certification.description.slice(0, 160),
  };
}

export default async function CertificationPage({
  params,
}: CertificationPageProps) {
  const { slug } = await params;
  const { userId } = await auth();

  const certification = await prisma.instructorCertification.findUnique({
    where: { slug, isActive: true },
  });

  if (!certification) {
    notFound();
  }

  // Get required courses
  let requiredCourses: { id: string; title: string; slug: string }[] = [];
  if (certification.requiredCourseIds) {
    try {
      const courseIds = JSON.parse(certification.requiredCourseIds) as string[];
      requiredCourses = await prisma.course.findMany({
        where: { id: { in: courseIds }, status: "PUBLISHED" },
        select: { id: true, title: true, slug: true },
      });
    } catch {
      // Invalid JSON, ignore
    }
  }

  // Get user's application and progress if logged in
  let userApplication: {
    id: string;
    status: string;
    completedCourseIds: string | null;
    watchedHours: number;
    quizScores: string | null;
    certificateNumber: string | null;
    issuedAt: Date | null;
    expiresAt: Date | null;
  } | null = null;
  let completedCourseCount = 0;
  let totalWatchedHours = 0;

  if (userId) {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (user) {
      const application = await prisma.certificationApplication.findUnique({
        where: {
          userId_certificationId: {
            userId: user.id,
            certificationId: certification.id,
          },
        },
      });

      if (application) {
        userApplication = application;
        if (application.completedCourseIds) {
          try {
            const completed = JSON.parse(application.completedCourseIds) as string[];
            completedCourseCount = completed.length;
          } catch {
            // Invalid JSON
          }
        }
        totalWatchedHours = application.watchedHours;
      }

      // Calculate actual progress from lesson progress
      if (!userApplication) {
        // Get total watch time
        const progress = await prisma.lessonProgress.aggregate({
          where: { userId: user.id },
          _sum: { watchedSeconds: true },
        });
        totalWatchedHours = Math.floor((progress._sum.watchedSeconds || 0) / 3600);

        // Count completed required courses
        if (requiredCourses.length > 0) {
          for (const course of requiredCourses) {
            const courseModules = await prisma.module.findMany({
              where: { courseId: course.id },
              include: { lessons: { select: { id: true } } },
            });
            const allLessonIds = courseModules.flatMap((m) =>
              m.lessons.map((l) => l.id)
            );

            if (allLessonIds.length > 0) {
              const completedLessons = await prisma.lessonProgress.count({
                where: {
                  userId: user.id,
                  lessonId: { in: allLessonIds },
                  completed: true,
                },
              });

              if (completedLessons === allLessonIds.length) {
                completedCourseCount++;
              }
            }
          }
        }
      }
    }
  }

  const isApproved = userApplication?.status === "APPROVED";
  const hasApplied = !!userApplication;

  // Calculate progress percentages
  const courseProgress = requiredCourses.length > 0
    ? Math.min(100, (completedCourseCount / requiredCourses.length) * 100)
    : 100;
  const hoursProgress = certification.requiredWatchHours > 0
    ? Math.min(100, (totalWatchedHours / certification.requiredWatchHours) * 100)
    : 100;
  const overallProgress = Math.floor((courseProgress + hoursProgress) / 2);

  return (
    <div className="py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/certifications"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          All Certifications
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Award className="h-8 w-8" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">
                  {getDisciplineLabel(certification.discipline)}
                </Badge>
                <Badge variant="secondary">{levelLabels[certification.level]}</Badge>
                {isApproved && (
                  <Badge className="bg-green-600">Certified</Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold">{certification.title}</h1>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Certification</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {certification.description}
                </p>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
                <CardDescription>
                  Complete all requirements to apply for certification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Required Courses */}
                {requiredCourses.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        <span className="font-medium">Required Courses</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {completedCourseCount}/{requiredCourses.length} completed
                      </span>
                    </div>
                    <Progress value={courseProgress} className="mb-3" />
                    <div className="space-y-2">
                      {requiredCourses.map((course) => (
                        <Link
                          key={course.id}
                          href={`/courses/${course.slug}`}
                          className="flex items-center gap-2 text-sm hover:underline"
                        >
                          <CheckCircle2
                            className={`h-4 w-4 ${
                              completedCourseCount > 0
                                ? "text-green-500"
                                : "text-muted-foreground"
                            }`}
                          />
                          {course.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Watch Hours */}
                {certification.requiredWatchHours > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        <span className="font-medium">Watch Hours</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {totalWatchedHours}/{certification.requiredWatchHours}h
                      </span>
                    </div>
                    <Progress value={hoursProgress} />
                  </div>
                )}

                {/* Quiz Score */}
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  <span className="font-medium">Minimum Quiz Score:</span>
                  <span className="text-muted-foreground">
                    {certification.minimumQuizScore}%
                  </span>
                </div>

                {/* Video Submission */}
                <div className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  <span className="font-medium">Technique Video Submission</span>
                  <span className="text-muted-foreground">(Required)</span>
                </div>
              </CardContent>
            </Card>

            {/* Application Status */}
            {userApplication && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Application</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Status</span>
                    <Badge className={statusLabels[userApplication.status]?.color}>
                      {statusLabels[userApplication.status]?.label}
                    </Badge>
                  </div>
                  {isApproved && userApplication.certificateNumber && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Certificate Number</span>
                        <span className="font-mono">{userApplication.certificateNumber}</span>
                      </div>
                      {userApplication.issuedAt && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Issued</span>
                          <span>
                            {new Date(userApplication.issuedAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {userApplication.expiresAt && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Valid Until</span>
                          <span>
                            {new Date(userApplication.expiresAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Card */}
            <Card>
              <CardHeader>
                <CardTitle>Your Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center mb-4">
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle
                        className="text-muted stroke-current"
                        strokeWidth="8"
                        fill="none"
                        cx="50"
                        cy="50"
                        r="42"
                      />
                      <circle
                        className="text-primary stroke-current"
                        strokeWidth="8"
                        fill="none"
                        cx="50"
                        cy="50"
                        r="42"
                        strokeDasharray={`${overallProgress * 2.64} 264`}
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold">{overallProgress}%</span>
                    </div>
                  </div>
                </div>
                <p className="text-center text-sm text-muted-foreground">
                  {overallProgress >= 100
                    ? "You've met all requirements!"
                    : "Keep learning to complete requirements"}
                </p>
              </CardContent>
            </Card>

            {/* CTA Card */}
            <Card>
              <CardHeader>
                <CardTitle>Ready to Apply?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {certification.price > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Application Fee</span>
                    <span className="font-bold">
                      €{(certification.price / 100).toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Validity</span>
                  <span className="font-medium">{certification.validityMonths} months</span>
                </div>

                {userId ? (
                  isApproved ? (
                    <Button className="w-full" variant="outline">
                      Download Certificate
                    </Button>
                  ) : hasApplied ? (
                    <Button className="w-full" disabled>
                      Application Submitted
                    </Button>
                  ) : overallProgress >= 100 ? (
                    <Link href={`/certifications/${slug}/apply`}>
                      <Button className="w-full">Apply Now</Button>
                    </Link>
                  ) : (
                    <Button className="w-full" disabled>
                      Complete Requirements First
                    </Button>
                  )
                ) : (
                  <Link href="/sign-in">
                    <Button className="w-full">Sign In to Apply</Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
