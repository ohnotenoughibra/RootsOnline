import { redirect } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock, Video, MessageSquare, Plus } from "lucide-react";

import { getCurrentUser, hasActiveSubscription } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

export default async function QASessionsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const isSubscribed = await hasActiveSubscription();

  // Get user's Q&A sessions
  const sessions = await prisma.qASession.findMany({
    where: { studentId: user.id },
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
    orderBy: { scheduledAt: "desc" },
  });

  // Get available coaches
  const coaches = await prisma.user.findMany({
    where: {
      role: { in: ["COACH", "ADMIN"] },
      coursesCreated: { some: { status: "PUBLISHED" } },
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      imageUrl: true,
      _count: {
        select: { coursesCreated: { where: { status: "PUBLISHED" } } },
      },
    },
  });

  const upcomingSessions = sessions.filter(
    (s) => s.status !== "CANCELLED" && s.status !== "COMPLETED" && new Date(s.scheduledAt) > new Date()
  );

  const pastSessions = sessions.filter(
    (s) => s.status === "COMPLETED" || new Date(s.scheduledAt) <= new Date()
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="secondary">Pending</Badge>;
      case "CONFIRMED":
        return <Badge variant="default" className="bg-green-500">Confirmed</Badge>;
      case "COMPLETED":
        return <Badge variant="outline">Completed</Badge>;
      case "CANCELLED":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Q&A Sessions</h1>
            <p className="mt-1 text-muted-foreground">
              Book 1-on-1 sessions with our coaches
            </p>
          </div>
        </div>

        {/* Subscription Check */}
        {!isSubscribed && (
          <Card className="mb-8 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <h3 className="font-semibold">Unlock Q&A Sessions</h3>
                <p className="text-sm text-muted-foreground">
                  Subscribe to book personal coaching sessions
                </p>
              </div>
              <Link href="/pricing">
                <Button>View Plans</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Available Coaches */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Available Coaches</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {coaches.map((coach) => (
              <Card key={coach.id} className="p-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={coach.imageUrl || undefined} />
                    <AvatarFallback>
                      {getInitials(coach.firstName, coach.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold">
                      {coach.firstName} {coach.lastName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {coach._count.coursesCreated} courses
                    </p>
                  </div>
                  <Link href={`/dashboard/qa-sessions/book?coach=${coach.id}`}>
                    <Button size="sm" disabled={!isSubscribed}>
                      <Plus className="h-4 w-4 mr-1" />
                      Book
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Upcoming Sessions */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Upcoming Sessions</h2>
          {upcomingSessions.length === 0 ? (
            <Card className="p-8 text-center">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No upcoming sessions</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {upcomingSessions.map((session) => (
                <Card key={session.id} className="p-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={session.coach.imageUrl || undefined} />
                      <AvatarFallback>
                        {getInitials(session.coach.firstName, session.coach.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{session.topic}</h3>
                        {getStatusBadge(session.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        with {session.coach.firstName} {session.coach.lastName}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(session.scheduledAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {new Date(session.scheduledAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        <span>{session.duration} min</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      {session.meetingUrl && session.status === "CONFIRMED" && (
                        <a href={session.meetingUrl} target="_blank" rel="noopener noreferrer">
                          <Button size="sm">
                            <Video className="h-4 w-4 mr-1" />
                            Join
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Past Sessions */}
        {pastSessions.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Past Sessions</h2>
            <div className="space-y-4">
              {pastSessions.slice(0, 5).map((session) => (
                <Card key={session.id} className="p-4 opacity-75">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={session.coach.imageUrl || undefined} />
                      <AvatarFallback>
                        {getInitials(session.coach.firstName, session.coach.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{session.topic}</h3>
                        {getStatusBadge(session.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(session.scheduledAt).toLocaleDateString()}
                      </p>
                      {session.notes && (
                        <div className="mt-2 p-3 bg-muted rounded-lg">
                          <p className="text-sm flex items-start gap-2">
                            <MessageSquare className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            {session.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
