import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  GraduationCap,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Video,
  FileText,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CertificationReviewActions } from "@/components/admin/certification-review-actions";
import { getDisciplineLabel } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Certification Applications | Admin",
  description: "Review and manage instructor certification applications",
};

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  PENDING: { label: "Pending", variant: "secondary" },
  IN_REVIEW: { label: "In Review", variant: "outline" },
  APPROVED: { label: "Approved", variant: "default" },
  REJECTED: { label: "Rejected", variant: "destructive" },
  EXPIRED: { label: "Expired", variant: "secondary" },
};

export default async function AdminCertificationsPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    redirect("/");
  }

  // Get all applications with user and certification info
  const applications = await prisma.certificationApplication.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          imageUrl: true,
        },
      },
      certification: {
        select: {
          id: true,
          title: true,
          slug: true,
          discipline: true,
          level: true,
        },
      },
    },
  });

  // Count by status
  const pendingCount = applications.filter((a) => a.status === "PENDING").length;
  const inReviewCount = applications.filter((a) => a.status === "IN_REVIEW").length;
  const approvedCount = applications.filter((a) => a.status === "APPROVED").length;

  return (
    <div className="py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Certification Applications</h1>
            <p className="mt-1 text-muted-foreground">
              Review and manage instructor certification applications
            </p>
          </div>
          <Link href="/admin">
            <Button variant="outline">Back to Admin</Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{applications.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-yellow-600">
                Pending Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{pendingCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-600">
                In Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{inReviewCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-600">
                Approved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{approvedCount}</p>
            </CardContent>
          </Card>
        </div>

        {/* Applications Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Applications</CardTitle>
            <CardDescription>
              Click on an application to review details and take action
            </CardDescription>
          </CardHeader>
          <CardContent>
            {applications.length === 0 ? (
              <div className="text-center py-12">
                <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No applications yet</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Certification</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Materials</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((application) => (
                    <TableRow key={application.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {application.user.firstName} {application.user.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {application.user.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {application.certification.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {getDisciplineLabel(
                              application.certification.discipline as "MMA" | "KICKBOXING" | "GRAPPLING"
                            )}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={statusConfig[application.status]?.variant || "secondary"}
                        >
                          {statusConfig[application.status]?.label || application.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(application.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {application.videoSubmissionUrl && (
                            <a
                              href={application.videoSubmissionUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <Video className="h-4 w-4" />
                            </a>
                          )}
                          {application.resumeUrl && (
                            <a
                              href={application.resumeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <FileText className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <CertificationReviewActions
                          applicationId={application.id}
                          currentStatus={application.status}
                          applicantName={`${application.user.firstName} ${application.user.lastName}`}
                          certificationTitle={application.certification.title}
                          videoUrl={application.videoSubmissionUrl}
                          additionalNotes={application.additionalNotes}
                          watchedHours={application.watchedHours}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
