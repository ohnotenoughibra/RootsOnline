import Link from "next/link";
import type { Metadata } from "next";
import {
  Building2,
  Users,
  Calendar,
  TrendingUp,
  MessageSquare,
  FileText,
  BookOpen,
  Award,
  DollarSign,
  Scale,
  Wrench,
  Laptop,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Business Academy | Roots Collective",
  description:
    "Learn how to run a successful martial arts gym. Courses on gym operations, marketing, events, community building, and more.",
};

const categories = [
  {
    id: "GYM_OPERATIONS",
    title: "Gym Operations",
    description: "Day-to-day management, scheduling, and systems",
    icon: Building2,
    color: "bg-blue-100 text-blue-700",
  },
  {
    id: "MARKETING",
    title: "Marketing & Growth",
    description: "Attract new members and build your brand",
    icon: TrendingUp,
    color: "bg-green-100 text-green-700",
  },
  {
    id: "EVENTS",
    title: "Events & Competitions",
    description: "Run successful tournaments and seminars",
    icon: Calendar,
    color: "bg-purple-100 text-purple-700",
  },
  {
    id: "COMMUNITY",
    title: "Community Building",
    description: "Create culture and retain members long-term",
    icon: Users,
    color: "bg-orange-100 text-orange-700",
  },
  {
    id: "FINANCE",
    title: "Finance & Pricing",
    description: "Pricing strategies and financial management",
    icon: DollarSign,
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "STAFFING",
    title: "Staffing & Training",
    description: "Hire and develop great instructors",
    icon: Award,
    color: "bg-pink-100 text-pink-700",
  },
  {
    id: "LEGAL",
    title: "Legal & Insurance",
    description: "Protect your business and members",
    icon: Scale,
    color: "bg-red-100 text-red-700",
  },
  {
    id: "FACILITIES",
    title: "Facilities & Equipment",
    description: "Setup, maintenance, and optimization",
    icon: Wrench,
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    id: "TECHNOLOGY",
    title: "Technology & Systems",
    description: "Software and tools for modern gyms",
    icon: Laptop,
    color: "bg-cyan-100 text-cyan-700",
  },
];

export default async function BusinessAcademyPage() {
  // Get business courses
  const courses = await prisma.course.findMany({
    where: {
      discipline: "BUSINESS",
      status: "PUBLISHED",
    },
    include: {
      coach: {
        select: {
          firstName: true,
          lastName: true,
          imageUrl: true,
        },
      },
      _count: {
        select: { modules: true },
      },
    },
    orderBy: { publishedAt: "desc" },
    take: 6,
  });

  // Get recent Q&A
  const recentQuestions = await prisma.businessQuestion.findMany({
    include: {
      user: {
        select: { firstName: true, lastName: true },
      },
      _count: {
        select: { answers: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  // Get resource count
  const resourceCount = await prisma.businessResource.count();

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            For Gym Owners & Affiliates
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Business Academy
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Everything you need to build, grow, and scale a successful martial arts gym.
            Learn from experienced gym owners and industry experts.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/business/courses">
              <Button size="lg">
                <BookOpen className="h-5 w-5 mr-2" />
                Browse Courses
              </Button>
            </Link>
            <Link href="/business/qa">
              <Button size="lg" variant="outline">
                <MessageSquare className="h-5 w-5 mr-2" />
                Ask a Question
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold">{courses.length}+</p>
              <p className="text-sm text-muted-foreground">Business Courses</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold">{recentQuestions.length}+</p>
              <p className="text-sm text-muted-foreground">Q&A Discussions</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold">{resourceCount}+</p>
              <p className="text-sm text-muted-foreground">Resources</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold">10</p>
              <p className="text-sm text-muted-foreground">Topic Categories</p>
            </CardContent>
          </Card>
        </div>

        {/* Categories Grid */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold">Learn By Topic</h2>
              <p className="text-muted-foreground">
                Explore content organized by business area
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/business/courses?category=${category.id}`}
              >
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-2">
                    <div
                      className={`w-10 h-10 rounded-lg ${category.color} flex items-center justify-center mb-2`}
                    >
                      <category.icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Courses */}
        {courses.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold">Featured Courses</h2>
                <p className="text-muted-foreground">
                  Start learning with our most popular business courses
                </p>
              </div>
              <Link href="/business/courses">
                <Button variant="outline">View All Courses</Button>
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Link key={course.id} href={`/courses/${course.slug}`}>
                  <Card className="h-full hover:shadow-md transition-shadow">
                    {course.coverImage && (
                      <div className="aspect-video relative overflow-hidden rounded-t-lg">
                        <img
                          src={course.coverImage}
                          alt={course.title}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {course.shortDescription || course.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>
                          {course.coach.firstName} {course.coach.lastName}
                        </span>
                        <span>{course._count.modules} modules</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Q&A Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold">Community Q&A</h2>
              <p className="text-muted-foreground">
                Get answers from experienced gym owners
              </p>
            </div>
            <Link href="/business/qa">
              <Button variant="outline">View All Questions</Button>
            </Link>
          </div>
          {recentQuestions.length > 0 ? (
            <div className="space-y-4">
              {recentQuestions.map((question) => (
                <Link key={question.id} href={`/business/qa/${question.id}`}>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="py-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium line-clamp-1">
                            {question.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                            {question.content}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>
                              {question.user.firstName} {question.user.lastName}
                            </span>
                            <span>{question._count.answers} answers</span>
                          </div>
                        </div>
                        <Badge variant={question.isAnswered ? "default" : "secondary"}>
                          {question.isAnswered ? "Answered" : "Open"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">No questions yet</h3>
                <p className="text-muted-foreground mb-4">
                  Be the first to ask a question to the community
                </p>
                <Link href="/business/qa/ask">
                  <Button>Ask a Question</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Resources CTA */}
        <section>
          <Card className="bg-muted/50">
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">
                Templates & Resources
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto mb-6">
                Download ready-to-use templates, checklists, and guides to
                streamline your gym operations.
              </p>
              <Link href="/business/resources">
                <Button size="lg">
                  Browse Resources
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
