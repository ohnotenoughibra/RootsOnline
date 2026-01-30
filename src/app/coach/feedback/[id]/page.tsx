import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Video, User, Calendar, AlertCircle } from "lucide-react";

import { getCurrentUser, isCoach } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getDisciplineLabel } from "@/lib/utils";
import { FeedbackForm } from "./feedback-form";

export const dynamic = "force-dynamic";

interface ReviewFootagePageProps {
  params: Promise<{ id: string }>;
}

export default async function ReviewFootagePage({ params }: ReviewFootagePageProps) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    const canAccess = await isCoach();

    if (!user) {
      redirect("/sign-in");
    }

    if (!canAccess) {
      return (
        <div className="py-12">
          <div className="mx-auto max-w-2xl px-4 text-center">
            <Card className="p-8">
              <AlertCircle className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
              <h1 className="text-2xl font-bold mb-2">Coach Access Required</h1>
              <p className="text-muted-foreground mb-6">
                You need coach permissions to review training footage.
              </p>
              <Link href="/dashboard">
                <Button>Go to Dashboard</Button>
              </Link>
            </Card>
          </div>
        </div>
      );
    }

    const footage = await prisma.trainingFootage.findUnique({
      where: { id },
      include: {
        member: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            imageUrl: true,
            email: true,
          },
        },
        feedback: {
          include: {
            coach: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                imageUrl: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!footage) {
      notFound();
    }

    const hasAlreadyReviewed = footage.feedback.some(
      (f) => f.coachId === user.id
    );

    return (
      <div className="py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link
            href="/coach/feedback"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Feedback Queue
          </Link>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Video and Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Video Player */}
              <Card>
                <CardContent className="p-0">
                  <div className="aspect-video bg-black rounded-t-lg overflow-hidden">
                    {footage.videoUrl ? (
                      <video
                        src={footage.videoUrl}
                        controls
                        className="w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Video className="h-16 w-16 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <h1 className="text-xl font-bold">{footage.title}</h1>
                      <Badge variant="secondary">
                        {getDisciplineLabel(footage.discipline)}
                      </Badge>
                    </div>
                    {footage.description && (
                      <p className="text-muted-foreground">
                        {footage.description}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Feedback Form */}
              {!hasAlreadyReviewed && footage.status === "PENDING" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Provide Feedback</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FeedbackForm footageId={footage.id} />
                  </CardContent>
                </Card>
              )}

              {/* Existing Feedback */}
              {footage.feedback.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Feedback History</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {footage.feedback.map((feedback) => (
                      <div
                        key={feedback.id}
                        className="border rounded-lg p-4 space-y-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-medium">
                            {feedback.coach.firstName?.[0] || "C"}
                          </div>
                          <div>
                            <p className="font-medium">
                              {feedback.coach.firstName} {feedback.coach.lastName}
                              {feedback.coachId === user.id && (
                                <span className="text-xs text-muted-foreground ml-2">
                                  (You)
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(feedback.createdAt).toLocaleDateString()}{" "}
                              at{" "}
                              {new Date(feedback.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                          {feedback.rating && (
                            <Badge variant="outline" className="ml-auto">
                              Rating: {feedback.rating}/5
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm whitespace-pre-wrap">
                          {feedback.content}
                        </p>
                        {feedback.videoUrl && (
                          <div className="pt-2">
                            <p className="text-sm font-medium mb-2">
                              Video Response:
                            </p>
                            <video
                              src={feedback.videoUrl}
                              controls
                              className="w-full max-h-48 rounded-md"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Member Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    Submitted By
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-medium">
                      {footage.member.firstName?.[0] || "M"}
                    </div>
                    <div>
                      <p className="font-medium">
                        {footage.member.firstName} {footage.member.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {footage.member.email}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Submission Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Submitted:</span>
                    <span>
                      {new Date(footage.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Video className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Status:</span>
                    <Badge
                      variant={
                        footage.status === "REVIEWED" ? "default" : "secondary"
                      }
                    >
                      {footage.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Reviews:</span>
                    <span>{footage.feedback.length}</span>
                  </div>
                </CardContent>
              </Card>

              {hasAlreadyReviewed && (
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-green-700">
                      You have already provided feedback for this submission.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Review footage page error:", error);

    return (
      <div className="py-12">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <Card className="p-8">
            <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
            <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
            <p className="text-muted-foreground mb-6">
              Unable to load this footage. Please try again later.
            </p>
            <Link href="/coach/feedback">
              <Button>Back to Queue</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }
}
