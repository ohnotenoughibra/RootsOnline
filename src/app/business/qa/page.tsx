import Link from "next/link";
import type { Metadata } from "next";
import { MessageSquare, Plus, Search } from "lucide-react";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const metadata: Metadata = {
  title: "Business Q&A | Roots Collective",
  description: "Ask questions and get answers from experienced gym owners and martial arts business experts.",
};

const categoryLabels: Record<string, string> = {
  GYM_OPERATIONS: "Gym Operations",
  MARKETING: "Marketing",
  EVENTS: "Events",
  COMMUNITY: "Community",
  FINANCE: "Finance",
  LEGAL: "Legal",
  STAFFING: "Staffing",
  FACILITIES: "Facilities",
  TECHNOLOGY: "Technology",
  GROWTH: "Growth",
};

interface QAPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    status?: string;
  }>;
}

export default async function BusinessQAPage({ searchParams }: QAPageProps) {
  const { userId } = await auth();
  const params = await searchParams;

  // Build where clause
  const where: Record<string, unknown> = {};

  if (params.category && params.category !== "all") {
    where.category = params.category;
  }

  if (params.status === "answered") {
    where.isAnswered = true;
  } else if (params.status === "unanswered") {
    where.isAnswered = false;
  }

  if (params.search) {
    where.OR = [
      { title: { contains: params.search, mode: "insensitive" } },
      { content: { contains: params.search, mode: "insensitive" } },
    ];
  }

  const questions = await prisma.businessQuestion.findMany({
    where,
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
          imageUrl: true,
          role: true,
        },
      },
      _count: {
        select: { answers: true },
      },
    },
    orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
  });

  // Get category counts
  const categoryCounts = await prisma.businessQuestion.groupBy({
    by: ["category"],
    _count: true,
  });

  const categoryCountMap = Object.fromEntries(
    categoryCounts.map((c) => [c.category, c._count])
  );

  return (
    <div className="py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href="/business"
              className="text-sm text-muted-foreground hover:text-foreground mb-2 block"
            >
              ← Back to Business Academy
            </Link>
            <h1 className="text-3xl font-bold">Business Q&A</h1>
            <p className="mt-1 text-muted-foreground">
              Ask questions and learn from the community
            </p>
          </div>
          {userId && (
            <Link href="/business/qa/ask">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Ask Question
              </Button>
            </Link>
          )}
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="py-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <form>
                  <Input
                    name="search"
                    placeholder="Search questions..."
                    defaultValue={params.search}
                    className="pl-9"
                  />
                </form>
              </div>
              <Select defaultValue={params.category || "all"}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {Object.entries(categoryLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label} ({categoryCountMap[value] || 0})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select defaultValue={params.status || "all"}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="answered">Answered</SelectItem>
                  <SelectItem value="unanswered">Unanswered</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Questions List */}
        {questions.length > 0 ? (
          <div className="space-y-4">
            {questions.map((question) => (
              <Link key={question.id} href={`/business/qa/${question.id}`}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="py-6">
                    <div className="flex items-start gap-4">
                      {/* Vote count placeholder */}
                      <div className="hidden sm:flex flex-col items-center text-center min-w-[60px]">
                        <span className="text-2xl font-bold">
                          {question._count.answers}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {question._count.answers === 1 ? "answer" : "answers"}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2 mb-2">
                          {question.isPinned && (
                            <Badge variant="secondary">Pinned</Badge>
                          )}
                          <Badge
                            variant={question.isAnswered ? "default" : "outline"}
                            className={
                              question.isAnswered
                                ? "bg-green-100 text-green-800"
                                : ""
                            }
                          >
                            {question.isAnswered ? "Answered" : "Open"}
                          </Badge>
                          <Badge variant="secondary">
                            {categoryLabels[question.category]}
                          </Badge>
                        </div>

                        <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                          {question.title}
                        </h3>

                        <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                          {question.content}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            {question.user.imageUrl && (
                              <img
                                src={question.user.imageUrl}
                                alt=""
                                className="h-5 w-5 rounded-full"
                              />
                            )}
                            <span>
                              {question.user.firstName} {question.user.lastName}
                            </span>
                            {question.user.role === "COACH" && (
                              <Badge variant="outline" className="text-[10px] py-0">
                                Coach
                              </Badge>
                            )}
                          </div>
                          <span>
                            {new Date(question.createdAt).toLocaleDateString()}
                          </span>
                          <span>{question.viewCount} views</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No questions found</h3>
              <p className="text-muted-foreground mb-6">
                {params.search || params.category
                  ? "Try adjusting your filters"
                  : "Be the first to ask a question!"}
              </p>
              {userId && (
                <Link href="/business/qa/ask">
                  <Button>Ask a Question</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
