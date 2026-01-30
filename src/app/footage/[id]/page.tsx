import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Video, Calendar, Clock, CheckCircle, AlertCircle, Star } from "lucide-react";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getDisciplineLabel } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface FootageDetailPageProps {
  params: Promise<{ id: string }>;
}

function getStatusBadge(status: string) {
  switch (status) {
    case "PENDING":
      return (
        <Badge variant="secondary">
          <Clock className="h-3 w-3 mr-1" />
          Pending Review
        </Badge>
      );
    case "REVIEWED":
      return (
        <Badge variant="default">
          <CheckCircle className="h-3 w-3 mr-1" />
          Reviewed
        </Badge>
      );
    case "ARCHIVED":
      return <Badge variant="outline">Archived</Badge>;
    default:
      return null;
  }
}

export default async function FootageDetailPage({ params }: FootageDetailPageProps) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();

    if (!user) {
      redirect("/sign-in");
    }

    const footage = await prisma.trainingFootage.findUnique({
      where: { id },
      include: {
        member: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
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

    // Only allow the owner to view their footage
    if (footage.memberId !== user.id) {
      return (
        <div className="py-12">
          <div className="mx-auto max-w-2xl px-4 text-center">
            <Card className="p-8">
              <AlertCircle className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
              <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
              <p className="text-muted-foreground mb-6">
                You can only view your own training footage.
              </p>
              <Link href="/footage">
                <Button>Go to My Footage</Button>
              </Link>
            </Card>
          </div>
        </div>
      );
    }

    return (
      <div className="py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link
            href="/footage"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to My Footage
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
                      {getStatusBadge(footage.status)}
                    </div>
                    {footage.description && (
                      <p className="text-muted-foreground">
                        {footage.description}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Feedback Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Coach Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                  {footage.feedback.length === 0 ? (
                    <div className="text-center py-8">
                      <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="font-medium">Awaiting Feedback</h3>
                      <p className="text-sm text-muted-foreground mt-2">
                        A coach will review your footage and provide feedback soon.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {footage.feedback.map((feedback) => (
                        <div
                          key={feedback.id}
                          className="border rounded-lg p-4 space-y-4"
                        >
                          {/* Coach Info */}
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-medium">
                              {feedback.coach.firstName?.[0] || "C"}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">
                                {feedback.coach.firstName} {feedback.coach.lastName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(feedback.createdAt).toLocaleDateString()}{" "}
                                at{" "}
                                {new Date(feedback.createdAt).toLocaleTimeString()}
                              </p>
                            </div>
                            {feedback.rating && (
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`h-4 w-4 ${
                                      star <= feedback.rating!
                                        ? "text-yellow-400 fill-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Feedback Content */}
                          <div className="bg-muted/50 rounded-md p-4">
                            <p className="whitespace-pre-wrap">{feedback.content}</p>
                          </div>

                          {/* Video Response */}
                          {feedback.videoUrl && (
                            <div>
                              <p className="text-sm font-medium mb-2">
                                Video Response from Coach:
                              </p>
                              <video
                                src={feedback.videoUrl}
                                controls
                                className="w-full rounded-md max-h-64"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Submission Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    Submission Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Video className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Discipline:</span>
                    <Badge variant="outline">
                      {getDisciplineLabel(footage.discipline)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Submitted:</span>
                    <span>
                      {new Date(footage.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Status:</span>
                    {getStatusBadge(footage.status)}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Feedback:</span>
                    <span>{footage.feedback.length} response(s)</span>
                  </div>
                </CardContent>
              </Card>

              {/* Status Card */}
              {footage.status === "PENDING" && (
                <Card className="bg-yellow-50 border-yellow-200">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-yellow-800">
                          Pending Review
                        </p>
                        <p className="text-xs text-yellow-700 mt-1">
                          Your footage is in the queue. A coach will review it soon.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {footage.status === "REVIEWED" && (
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-green-800">
                          Feedback Available
                        </p>
                        <p className="text-xs text-green-700 mt-1">
                          Check out the coach feedback above to improve your technique.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Footage detail page error:", error);

    return (
      <div className="py-12">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <Card className="p-8">
            <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
            <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
            <p className="text-muted-foreground mb-6">
              Unable to load this footage. Please try again later.
            </p>
            <Link href="/footage">
              <Button>Back to My Footage</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }
}
