"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Clock,
  CheckCircle,
  TrendingUp,
  ChevronDown,
  ChevronRight,
  Calendar,
  Search,
  BookOpen,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getInitials, formatDuration } from "@/lib/utils";

interface Course {
  id: string;
  title: string;
  slug: string;
}

interface StudentCourse {
  course: Course;
  lessonsStarted: number;
  lessonsCompleted: number;
  watchTime: number;
  lastLesson: {
    title: string;
    completed: boolean;
    progress: number;
  } | null;
}

interface Student {
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    imageUrl: string | null;
    createdAt: string;
  };
  totalLessonsStarted: number;
  totalLessonsCompleted: number;
  totalWatchTime: number;
  lastActive: string;
  courses: StudentCourse[];
}

interface Summary {
  totalStudents: number;
  activeThisWeek: number;
  activeThisMonth: number;
  totalWatchTime: number;
  totalCompletions: number;
}

function formatRelativeTime(date: string): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
}

function StudentRow({ student, expanded, onToggle }: {
  student: Student;
  expanded: boolean;
  onToggle: () => void;
}) {
  const completionRate = student.totalLessonsStarted > 0
    ? Math.round((student.totalLessonsCompleted / student.totalLessonsStarted) * 100)
    : 0;

  const isActive = new Date(student.lastActive) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors"
      >
        <Avatar className="h-10 w-10">
          <AvatarImage src={student.user.imageUrl || undefined} />
          <AvatarFallback>
            {getInitials(student.user.firstName, student.user.lastName)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 text-left">
          <div className="flex items-center gap-2">
            <span className="font-medium">
              {student.user.firstName} {student.user.lastName}
            </span>
            {isActive && (
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                Active
              </Badge>
            )}
          </div>
          <span className="text-sm text-muted-foreground">{student.user.email}</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm">
          <div className="text-center">
            <div className="font-medium">{student.totalLessonsCompleted}</div>
            <div className="text-muted-foreground">Completed</div>
          </div>
          <div className="text-center">
            <div className="font-medium">{formatDuration(student.totalWatchTime)}</div>
            <div className="text-muted-foreground">Watch Time</div>
          </div>
          <div className="text-center">
            <div className="font-medium">{completionRate}%</div>
            <div className="text-muted-foreground">Completion</div>
          </div>
          <div className="text-center">
            <div className="font-medium">{formatRelativeTime(student.lastActive)}</div>
            <div className="text-muted-foreground">Last Active</div>
          </div>
        </div>

        {expanded ? (
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        )}
      </button>

      {expanded && (
        <div className="border-t bg-muted/30 p-4">
          <h4 className="font-medium mb-3">Course Progress</h4>
          <div className="space-y-3">
            {student.courses.map((sc) => (
              <div key={sc.course.id} className="bg-background rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <Link
                    href={`/courses/${sc.course.slug}`}
                    className="font-medium hover:underline"
                  >
                    {sc.course.title}
                  </Link>
                  <span className="text-sm text-muted-foreground">
                    {sc.lessonsCompleted}/{sc.lessonsStarted} lessons
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-2 bg-muted rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{
                      width: `${sc.lessonsStarted > 0 ? (sc.lessonsCompleted / sc.lessonsStarted) * 100 : 0}%`,
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Watch time: {formatDuration(sc.watchTime)}</span>
                  {sc.lastLesson && (
                    <span>
                      Last: {sc.lastLesson.title}
                      {sc.lastLesson.completed ? " ✓" : ` (${sc.lastLesson.progress}%)`}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Mobile stats */}
          <div className="md:hidden grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
            <div className="text-center">
              <div className="font-medium">{student.totalLessonsCompleted}</div>
              <div className="text-sm text-muted-foreground">Lessons Completed</div>
            </div>
            <div className="text-center">
              <div className="font-medium">{formatDuration(student.totalWatchTime)}</div>
              <div className="text-sm text-muted-foreground">Watch Time</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CoachStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<string>("all");
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("/api/coach/students");
        if (response.ok) {
          const data = await response.json();
          setStudents(data.students || []);
          setSummary(data.summary || null);
          setCourses(data.courses || []);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Filter students
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${student.user.firstName} ${student.user.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesCourse =
      selectedCourse === "all" ||
      student.courses.some((sc) => sc.course.id === selectedCourse);

    return matchesSearch && matchesCourse;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Student Progress</h1>
        <p className="text-muted-foreground">
          Track your students&apos; learning progress across all your courses
        </p>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.totalStudents}</div>
              <p className="text-xs text-muted-foreground">
                {summary.activeThisWeek} active this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active This Month</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.activeThisMonth}</div>
              <p className="text-xs text-muted-foreground">
                {summary.totalStudents > 0
                  ? Math.round((summary.activeThisMonth / summary.totalStudents) * 100)
                  : 0}
                % engagement rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Watch Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatDuration(summary.totalWatchTime)}
              </div>
              <p className="text-xs text-muted-foreground">Across all students</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lessons Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.totalCompletions}</div>
              <p className="text-xs text-muted-foreground">Total completions</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCourse} onValueChange={setSelectedCourse}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by course" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courses</SelectItem>
            {courses.map((course) => (
              <SelectItem key={course.id} value={course.id}>
                {course.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Students List */}
      {filteredStudents.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">No Students Yet</h2>
            <p className="text-muted-foreground">
              {searchQuery || selectedCourse !== "all"
                ? "No students match your filters."
                : "Once students start watching your courses, they'll appear here."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredStudents.map((student) => (
            <StudentRow
              key={student.user.id}
              student={student}
              expanded={expandedStudent === student.user.id}
              onToggle={() =>
                setExpandedStudent(
                  expandedStudent === student.user.id ? null : student.user.id
                )
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
