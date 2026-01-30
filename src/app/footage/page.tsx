import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, Video, Clock, CheckCircle, AlertCircle } from "lucide-react";

import { getCurrentUser } from "@/lib/auth";
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

export default async function FootagePage() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      redirect("/sign-in");
    }

    const footage = await prisma.trainingFootage.findMany({
      where: { memberId: user.id },
      include: {
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
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const pendingCount = footage.filter((f) => f.status === "PENDING").length;
    const reviewedCount = footage.filter((f) => f.status === "REVIEWED").length;

    return (
      <div className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">My Training Footage</h1>
              <p className="mt-1 text-muted-foreground">
                Upload your training videos for coach feedback
              </p>
            </div>
            <Link href="/footage/upload">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Upload Footage
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-3 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Submissions
                </CardTitle>
                <Video className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{footage.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Review
                </CardTitle>
                <Clock className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingCount}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Feedback Received
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reviewedCount}</div>
              </CardContent>
            </Card>
          </div>

          {/* Footage List */}
          {footage.length === 0 ? (
            <Card className="p-12 text-center">
              <Video className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">No footage yet</h3>
              <p className="text-muted-foreground mt-2 mb-6">
                Upload your training videos to get personalized feedback from our coaches.
              </p>
              <Link href="/footage/upload">
                <Button>Upload Your First Video</Button>
              </Link>
            </Card>
          ) : (
            <div className="grid gap-4">
              {footage.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Thumbnail */}
                      <div className="h-20 w-32 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                        {item.thumbnailUrl ? (
                          <img
                            src={item.thumbnailUrl}
                            alt={item.title}
                            className="h-full w-full object-cover rounded-md"
                          />
                        ) : (
                          <Video className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold truncate">{item.title}</h3>
                          {getStatusBadge(item.status)}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {item.description || "No description"}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>{getDisciplineLabel(item.discipline)}</span>
                          <span>
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                          {item.feedback.length > 0 && (
                            <span className="text-green-600">
                              {item.feedback.length} feedback
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Link href={`/footage/${item.id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>

                    {/* Feedback preview */}
                    {item.feedback.length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm font-medium mb-2">Latest Feedback:</p>
                        <div className="bg-muted p-3 rounded-md">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                              {item.feedback[0].coach.firstName?.[0] || "C"}
                            </div>
                            <span className="text-sm font-medium">
                              {item.feedback[0].coach.firstName}{" "}
                              {item.feedback[0].coach.lastName}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {item.feedback[0].content}
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Footage page error:", error);

    return (
      <div className="py-12">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <Card className="p-8">
            <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
            <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
            <p className="text-muted-foreground mb-6">
              Unable to load your footage. Please try again later.
            </p>
            <Link href="/dashboard">
              <Button>Go to Dashboard</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }
}
