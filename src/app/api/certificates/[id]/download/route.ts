import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";
import { generateCertificatePDF } from "@/lib/certificate-pdf";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { userId: clerkId } = await auth();
    const { id } = await params;

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get certificate with course and coach info
    const certificate = await prisma.certificate.findUnique({
      where: { id },
      include: {
        course: {
          include: {
            coach: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!certificate) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
    }

    // Verify ownership
    if (certificate.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Generate PDF
    const studentName = [certificate.user.firstName, certificate.user.lastName]
      .filter(Boolean)
      .join(" ") || "Student";

    const coachName = [certificate.course.coach.firstName, certificate.course.coach.lastName]
      .filter(Boolean)
      .join(" ") || "Coach";

    const doc = generateCertificatePDF({
      studentName,
      courseTitle: certificate.course.title,
      coachName,
      certificateNumber: certificate.certificateNumber,
      completedAt: certificate.completedAt,
      discipline: certificate.course.discipline,
    });

    // Return PDF as blob
    const pdfBuffer = doc.output("arraybuffer");

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="ROA-Certificate-${certificate.certificateNumber}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error generating certificate PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate certificate" },
      { status: 500 }
    );
  }
}
