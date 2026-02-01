import type { Metadata } from "next";
import Link from "next/link";
import { Users, ArrowRight } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getInitials, getDisciplineLabel } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Instructors",
  description:
    "Meet our martial arts instructors. Learn MMA, Kickboxing, and Grappling from experienced coaches.",
  openGraph: {
    title: "Our Instructors | ROA",
    description: "Meet our martial arts instructors",
    url: `${siteConfig.url}/instructors`,
  },
};

async function getInstructors() {
  const instructors = await prisma.user.findMany({
    where: {
      role: { in: ["COACH", "ADMIN"] },
      coursesCreated: {
        some: { status: "PUBLISHED" },
      },
    },
    include: {
      coursesCreated: {
        where: { status: "PUBLISHED" },
        select: {
          discipline: true,
        },
      },
      _count: {
        select: {
          coursesCreated: {
            where: { status: "PUBLISHED" },
          },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return instructors;
}

export default async function InstructorsPage() {
  const instructors = await getInstructors();

  return (
    <div className="flex flex-col">
      {/* Hero Section - Minimal */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Instructors
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Learn from experienced martial artists who are passionate about
            sharing their knowledge
          </p>
        </div>
      </section>

      {/* Instructors Grid */}
      <section className="py-12 border-t">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {instructors.length === 0 ? (
            <div className="py-20 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 mb-6">
                <Users className="h-7 w-7 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">No instructors yet</h3>
              <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                Instructors will appear here once they publish courses.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {instructors.map((instructor) => {
                const name = `${instructor.firstName} ${instructor.lastName}`;
                const disciplines = [
                  ...new Set(instructor.coursesCreated.map((c) => c.discipline)),
                ];

                return (
                  <div key={instructor.id} className="border-2 rounded-lg p-6">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-14 w-14">
                        <AvatarImage
                          src={instructor.imageUrl || undefined}
                          alt={name}
                        />
                        <AvatarFallback className="text-lg">
                          {getInitials(instructor.firstName, instructor.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {instructor._count.coursesCreated} course
                          {instructor._count.coursesCreated !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                      {disciplines.map((discipline) => (
                        <Badge
                          key={discipline}
                          variant="outline"
                        >
                          {getDisciplineLabel(discipline)}
                        </Badge>
                      ))}
                    </div>

                    <Link
                      href={`/instructors/${instructor.id}`}
                      className="block mt-4"
                    >
                      <Button variant="outline" className="w-full" size="sm">
                        View Profile
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
