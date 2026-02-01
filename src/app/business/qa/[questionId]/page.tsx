import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, CheckCircle2, MessageSquare } from "lucide-react";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AnswerForm } from "@/components/business/answer-form";
import { AnswerCard } from "@/components/business/answer-card";

interface QuestionPageProps {
  params: Promise<{
    questionId: string;
  }>;
}

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

export async function generateMetadata({
  params,
}: QuestionPageProps): Promise<Metadata> {
  const { questionId } = await params;
  const question = await prisma.businessQuestion.findUnique({
    where: { id: questionId },
    select: { title: true, content: true },
  });

  if (!question) {
    return { title: "Question Not Found" };
  }

  return {
    title: `${question.title} | Business Q&A`,
    description: question.content.slice(0, 160),
  };
}

export default async function QuestionPage({ params }: QuestionPageProps) {
  const { questionId } = await params;
  const { userId } = await auth();

  const question = await prisma.businessQuestion.findUnique({
    where: { id: questionId },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          imageUrl: true,
          role: true,
        },
      },
      answers: {
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              imageUrl: true,
              role: true,
            },
          },
        },
        orderBy: [{ isAccepted: "desc" }, { upvotes: "desc" }, { createdAt: "asc" }],
      },
    },
  });

  if (!question) {
    notFound();
  }

  // Increment view count
  await prisma.businessQuestion.update({
    where: { id: questionId },
    data: { viewCount: { increment: 1 } },
  });

  // Get current user
  let currentUser = null;
  if (userId) {
    currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true, role: true },
    });
  }

  const isQuestionOwner = currentUser?.id === question.userId;
  const isAdmin = currentUser?.role === "ADMIN";

  return (
    <div className="py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/business/qa"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Q&A
        </Link>

        {/* Question */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start gap-2 mb-4">
              <Badge variant="secondary">
                {categoryLabels[question.category]}
              </Badge>
              {question.isAnswered && (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Answered
                </Badge>
              )}
              {question.isPinned && <Badge>Pinned</Badge>}
            </div>
            <CardTitle className="text-2xl">{question.title}</CardTitle>
            <CardDescription>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-2">
                  {question.user.imageUrl && (
                    <img
                      src={question.user.imageUrl}
                      alt=""
                      className="h-6 w-6 rounded-full"
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
                  {question.user.role === "ADMIN" && (
                    <Badge variant="outline" className="text-[10px] py-0">
                      Admin
                    </Badge>
                  )}
                </div>
                <span className="text-muted-foreground">
                  {new Date(question.createdAt).toLocaleDateString()}
                </span>
                <span className="text-muted-foreground">
                  {question.viewCount} views
                </span>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-wrap">{question.content}</p>
            </div>
          </CardContent>
        </Card>

        {/* Answers */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {question.answers.length} {question.answers.length === 1 ? "Answer" : "Answers"}
          </h2>

          {question.answers.length > 0 ? (
            <div className="space-y-4">
              {question.answers.map((answer) => (
                <AnswerCard
                  key={answer.id}
                  answer={answer}
                  questionId={question.id}
                  isQuestionOwner={isQuestionOwner}
                  isAdmin={isAdmin}
                  currentUserId={currentUser?.id}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">
                  No answers yet. Be the first to help!
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <Separator className="my-8" />

        {/* Answer Form */}
        {userId ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">Your Answer</h2>
            <AnswerForm questionId={question.id} />
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground mb-4">
                Sign in to answer this question
              </p>
              <Link href="/sign-in">
                <button className="text-primary hover:underline">Sign In</button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
