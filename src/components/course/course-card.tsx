import Link from "next/link";
import Image from "next/image";
import { Clock, BookOpen, User } from "lucide-react";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials, getDisciplineLabel, getLanguageFlag } from "@/lib/utils";
import type { CourseWithCoach } from "@/types";

interface CourseCardProps {
  course: CourseWithCoach;
  lessonCount?: number;
  totalDuration?: number;
}

export function CourseCard({
  course,
  lessonCount = 0,
  totalDuration = 0,
}: CourseCardProps) {
  const disciplineVariant = course.discipline.toLowerCase() as
    | "mma"
    | "kickboxing"
    | "grappling";

  const hours = Math.floor(totalDuration / 3600);
  const minutes = Math.floor((totalDuration % 3600) / 60);
  const durationText =
    hours > 0 ? `${hours}h ${minutes}m` : `${minutes} minutes`;

  return (
    <Link href={`/courses/${course.slug}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
        {/* Cover Image */}
        <div className="relative aspect-video overflow-hidden bg-muted">
          {course.coverImage ? (
            <Image
              src={course.coverImage}
              alt={course.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
              <BookOpen className="h-12 w-12 text-muted-foreground/50" />
            </div>
          )}
          <div className="absolute left-3 top-3 flex gap-2">
            <Badge variant={disciplineVariant}>
              {getDisciplineLabel(course.discipline)}
            </Badge>
            {course.language && course.language !== "EN" && (
              <Badge variant="secondary">
                {getLanguageFlag(course.language)}
              </Badge>
            )}
          </div>
        </div>

        <CardContent className="p-4">
          {/* Title */}
          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
            {course.title}
          </h3>

          {/* Short description */}
          {course.shortDescription && (
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
              {course.shortDescription}
            </p>
          )}

          {/* Stats */}
          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
            {lessonCount > 0 && (
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                <span>{lessonCount} lessons</span>
              </div>
            )}
            {totalDuration > 0 && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{durationText}</span>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="border-t px-4 py-3">
          {/* Coach info */}
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={course.coach.imageUrl || undefined} />
              <AvatarFallback className="text-xs">
                {getInitials(course.coach.firstName, course.coach.lastName)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">
              {course.coach.firstName} {course.coach.lastName}
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
