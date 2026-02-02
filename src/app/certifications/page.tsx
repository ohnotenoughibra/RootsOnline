import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Award, GraduationCap, Clock, CheckCircle2 } from "lucide-react";
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
import { getDisciplineLabel } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Instructor Certifications | ROA",
  description: "Become a certified martial arts instructor through our comprehensive certification programs.",
};

const levelLabels: Record<string, string> = {
  LEVEL_1: "Level 1 - Foundation",
  LEVEL_2: "Level 2 - Intermediate",
  LEVEL_3: "Level 3 - Advanced",
  MASTER: "Master Instructor",
};

const levelColors: Record<string, string> = {
  LEVEL_1: "bg-blue-100 text-blue-800",
  LEVEL_2: "bg-purple-100 text-purple-800",
  LEVEL_3: "bg-orange-100 text-orange-800",
  MASTER: "bg-yellow-100 text-yellow-800",
};

export default async function CertificationsPage() {
  const { userId } = await auth();

  // Get all active certifications
  const certifications = await prisma.instructorCertification.findMany({
    where: { isActive: true },
    orderBy: [{ discipline: "asc" }, { level: "asc" }],
  });

  // Get user's applications if logged in
  let userApplications: { certificationId: string; status: string }[] = [];
  if (userId) {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });
    if (user) {
      const applications = await prisma.certificationApplication.findMany({
        where: { userId: user.id },
        select: { certificationId: true, status: true },
      });
      userApplications = applications;
    }
  }

  // Group by discipline
  const certificationsByDiscipline = certifications.reduce(
    (acc, cert) => {
      if (!acc[cert.discipline]) {
        acc[cert.discipline] = [];
      }
      acc[cert.discipline].push(cert);
      return acc;
    },
    {} as Record<string, typeof certifications>
  );

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <GraduationCap className="h-10 w-10" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            Instructor Certification Programs
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Elevate your teaching credentials with our recognized certification programs.
            Gain the knowledge and skills to teach martial arts professionally.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <Award className="h-8 w-8 mb-2" />
              <CardTitle>Industry Recognition</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our certifications are recognized by gyms and academies worldwide.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CheckCircle2 className="h-8 w-8 mb-2" />
              <CardTitle>Comprehensive Training</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Complete structured courses with practical assessments.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Clock className="h-8 w-8 mb-2" />
              <CardTitle>Learn at Your Pace</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Study online and progress through requirements on your schedule.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Certifications by Discipline */}
        {Object.entries(certificationsByDiscipline).map(([discipline, certs]) => (
          <section key={discipline} className="mb-12">
            <h2 className="text-2xl font-bold mb-6">
              {getDisciplineLabel(discipline as "MMA" | "KICKBOXING" | "GRAPPLING")}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certs.map((cert) => {
                const userApp = userApplications.find(
                  (a) => a.certificationId === cert.id
                );
                const hasApplied = !!userApp;
                const isApproved = userApp?.status === "APPROVED";

                return (
                  <Card key={cert.id} className="flex flex-col">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <Badge className={levelColors[cert.level] || ""}>
                          {levelLabels[cert.level]}
                        </Badge>
                        {isApproved && (
                          <Badge variant="default" className="bg-green-600">
                            Certified
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="mt-2">{cert.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {cert.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Required Watch Hours</span>
                          <span className="font-medium">{cert.requiredWatchHours}h</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Minimum Quiz Score</span>
                          <span className="font-medium">{cert.minimumQuizScore}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Validity</span>
                          <span className="font-medium">{cert.validityMonths} months</span>
                        </div>
                        {cert.price > 0 && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Application Fee</span>
                            <span className="font-medium">
                              €{(cert.price / 100).toFixed(2)}
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <div className="p-6 pt-0 mt-auto">
                      <Link href={`/certifications/${cert.slug}`}>
                        <Button className="w-full" variant={isApproved ? "outline" : "default"}>
                          {isApproved
                            ? "View Certificate"
                            : hasApplied
                            ? "View Application"
                            : "Learn More"}
                        </Button>
                      </Link>
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>
        ))}

        {Object.keys(certificationsByDiscipline).length === 0 && (
          <div className="text-center py-12">
            <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              Certification Programs Coming Soon
            </h2>
            <p className="text-muted-foreground">
              We're developing comprehensive certification programs. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
