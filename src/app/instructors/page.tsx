import type { Metadata } from "next";
import Link from "next/link";
import { Users } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getInitials, getDisciplineLabel } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Instructors",
  description:
    "Meet our world-class martial arts instructors. Learn MMA, Kickboxing, and Grappling from experienced coaches.",
  openGraph: {
    title: "Our Instructors | ROA",
    description: "Meet our world-class martial arts instructors",
    url: `${siteConfig.url}/instructors`,
  },
};

async function getInstructors() {
  const instructors = await prisma.user.findMany({
    where: {
      role: { in: ["COACH", "ADMIN"] },
      courses: {
        some: { status: "PUBLISHED" },
      },
    },
    include: {
      courses: {
        where: { status: "PUBLISHED" },
        select: {
          discipline: true,
        },
      },
      _count: {
        select: {
          courses: {
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
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Our Instructors
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Learn from experienced martial artists who are passionate about
            sharing their knowledge and helping you achieve your goals.
          </p>
        </div>

        {/* Instructors Grid */}
        {instructors.length === 0 ? (
          <Card className="p-12 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No instructors yet</h3>
            <p className="text-muted-foreground mt-2">
              Instructors will appear here once they publish courses.
            </p>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {instructors.map((instructor) => {
              const name = `${instructor.firstName} ${instructor.lastName}`;
              const disciplines = [
                ...new Set(instructor.courses.map((c) => c.discipline)),
              ];

              return (
                <Card key={instructor.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage
                          src={instructor.imageUrl || undefined}
                          alt={name}
                        />
                        <AvatarFallback>
                          {getInitials(instructor.firstName, instructor.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-lg">{name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {instructor._count.courses} course
                          {instructor._count.courses !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                      {disciplines.map((discipline) => (
                        <Badge
                          key={discipline}
                          variant={
                            discipline.toLowerCase() as
                              | "mma"
                              | "kickboxing"
                              | "grappling"
                          }
                        >
                          {getDisciplineLabel(discipline)}
                        </Badge>
                      ))}
                    </div>

                    <Link
                      href={`/instructors/${instructor.id}`}
                      className="block mt-4"
                    >
                      <Button variant="outline" className="w-full">
                        View Profile
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
