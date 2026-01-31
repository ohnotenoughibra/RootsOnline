import Link from "next/link";
import { redirect } from "next/navigation";
import { Video, Clock, CheckCircle, AlertCircle, MessageSquare } from "lucide-react";

import { getCurrentUser, isCoach } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getDisciplineLabel } from "@/lib/utils";

export const dynamic = "force-dynamic";

function getStatusBadge(status: string) {
  switch (status) {
    case "PENDING":
      return (
        <Badge variant="secondary">
          <Clock className="h-3 w-3 mr-1" />
          Needs Review
        </Badge>
      );
    case "REVIEWED":
      return (
        <Badge variant="default">
          <CheckCircle className="h-3 w-3 mr-1" />
          Reviewed
        </Badge>
      );
    default:
      return null;
  }
}

export default async function CoachFeedbackPage() {
  try {
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

    // Get all pending footage submissions
    const pendingFootage = await prisma.trainingFootage.findMany({
      where: { status: "PENDING" },
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
      },
      orderBy: { createdAt: "asc" },
    });

    // Get total count of reviews by this coach
    const totalReviewCount = await prisma.videoFeedback.count({
      where: { coachId: user.id },
    });

    // Get footage this coach has reviewed (paginated)
    const reviewedByMe = await prisma.videoFeedback.findMany({
      where: { coachId: user.id },
      include: {
        footage: {
          include: {
            member: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return (
      <div className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Feedback Queue</h1>
            <p className="mt-1 text-muted-foreground">
              Review member training footage and provide feedback
            </p>
          </div>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-3 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Reviews
                </CardTitle>
                <Clock className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingFootage.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Your Reviews
                </CardTitle>
                <MessageSquare className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalReviewCount}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  This Week
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {
                    reviewedByMe.filter(
                      (f) =>
                        new Date(f.createdAt) >
                        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                    ).length
                  }
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pending Submissions */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-4">
              Pending Submissions ({pendingFootage.length})
            </h2>

            {pendingFootage.length === 0 ? (
              <Card className="p-8 text-center">
                <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                <h3 className="text-lg font-semibold">All caught up!</h3>
                <p className="text-muted-foreground mt-2">
                  There are no pending footage submissions to review.
                </p>
              </Card>
            ) : (
              <div className="grid gap-4">
                {pendingFootage.map((footage) => (
                  <Card key={footage.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        {/* Thumbnail */}
                        <div className="h-24 w-40 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                          {footage.thumbnailUrl ? (
                            <img
                              src={footage.thumbnailUrl}
                              alt={footage.title}
                              className="h-full w-full object-cover rounded-md"
                            />
                          ) : (
                            <Video className="h-8 w-8 text-muted-foreground" />
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold truncate">
                              {footage.title}
                            </h3>
                            {getStatusBadge(footage.status)}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {footage.description || "No description provided"}
                          </p>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                                {footage.member.firstName?.[0] || "M"}
                              </div>
                              <span>
                                {footage.member.firstName} {footage.member.lastName}
                              </span>
                            </div>
                            <span className="text-muted-foreground">
                              {getDisciplineLabel(footage.discipline)}
                            </span>
                            <span className="text-muted-foreground">
                              {new Date(footage.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <Link href={`/coach/feedback/${footage.id}`}>
                          <Button>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Review
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>

          {/* Recent Reviews */}
          {reviewedByMe.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4">Your Recent Reviews</h2>
              <div className="grid gap-4">
                {reviewedByMe.map((feedback) => (
                  <Card key={feedback.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium">
                              {feedback.footage.title}
                            </h3>
                            <Badge variant="outline">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Reviewed
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {feedback.content}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span>
                              Submitted by {feedback.footage.member.firstName}{" "}
                              {feedback.footage.member.lastName}
                            </span>
                            <span>
                              {new Date(feedback.createdAt).toLocaleDateString()}
                            </span>
                            {feedback.rating && (
                              <span>Rating: {feedback.rating}/5</span>
                            )}
                          </div>
                        </div>
                        <Link href={`/coach/feedback/${feedback.footageId}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Coach feedback page error:", error);

    return (
      <div className="py-12">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <Card className="p-8">
            <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
            <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
            <p className="text-muted-foreground mb-6">
              Unable to load the feedback queue. Please try again later.
            </p>
            <Link href="/coach">
              <Button>Go to Coach Studio</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }
}
