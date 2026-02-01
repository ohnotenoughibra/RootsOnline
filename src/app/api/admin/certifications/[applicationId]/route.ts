import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

function generateCertificateNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `RC-${timestamp}-${random}`;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ applicationId: string }> }
) {
  try {
    const { userId } = await auth();
    const { applicationId } = await params;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const admin = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await request.json();
    const { status, reviewNotes } = body;

    if (!status || !["APPROVED", "REJECTED", "IN_REVIEW"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Get application with user and certification info
    const application = await prisma.certificationApplication.findUnique({
      where: { id: applicationId },
      include: {
        user: { select: { email: true, firstName: true } },
        certification: { select: { title: true, validityMonths: true } },
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // Build update data
    const updateData: Record<string, unknown> = {
      status,
      reviewerId: admin.id,
      reviewNotes: reviewNotes || null,
      reviewedAt: new Date(),
    };

    // If approving, generate certificate
    if (status === "APPROVED") {
      const certificateNumber = generateCertificateNumber();
      const issuedAt = new Date();
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + application.certification.validityMonths);

      updateData.certificateNumber = certificateNumber;
      updateData.issuedAt = issuedAt;
      updateData.expiresAt = expiresAt;
    }

    // Update application
    const updatedApplication = await prisma.certificationApplication.update({
      where: { id: applicationId },
      data: updateData,
    });

    // Send email notification
    if (application.user.email) {
      const firstName = application.user.firstName || "there";
      const certTitle = application.certification.title;

      if (status === "APPROVED") {
        await sendEmail({
          to: application.user.email,
          subject: `Congratulations! Your ${certTitle} Certification is Approved`,
          html: `
            <h1>Congratulations, ${firstName}!</h1>
            <p>We're thrilled to inform you that your application for the <strong>${certTitle}</strong> certification has been approved.</p>
            <p><strong>Certificate Number:</strong> ${updateData.certificateNumber}</p>
            <p><strong>Valid Until:</strong> ${(updateData.expiresAt as Date).toLocaleDateString()}</p>
            <p>You can now use your certification credentials and download your certificate from your profile.</p>
            <p>Welcome to the Roots Collective instructor community!</p>
          `,
        });
      } else if (status === "REJECTED") {
        await sendEmail({
          to: application.user.email,
          subject: `Update on Your ${certTitle} Certification Application`,
          html: `
            <h1>Hello ${firstName},</h1>
            <p>Thank you for your interest in the <strong>${certTitle}</strong> certification.</p>
            <p>After careful review, we were unable to approve your application at this time.</p>
            ${reviewNotes ? `<p><strong>Reviewer Notes:</strong> ${reviewNotes}</p>` : ""}
            <p>We encourage you to continue developing your skills and apply again in the future.</p>
            <p>If you have questions, please don't hesitate to reach out.</p>
          `,
        });
      }
    }

    return NextResponse.json({
      success: true,
      application: {
        id: updatedApplication.id,
        status: updatedApplication.status,
        certificateNumber: updatedApplication.certificateNumber,
      },
    });
  } catch (error) {
    console.error("Error updating certification application:", error);
    return NextResponse.json(
      { error: "Failed to update application" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ applicationId: string }> }
) {
  try {
    const { userId } = await auth();
    const { applicationId } = await params;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const admin = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const application = await prisma.certificationApplication.findUnique({
      where: { id: applicationId },
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
        certification: true,
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ application });
  } catch (error) {
    console.error("Error fetching application:", error);
    return NextResponse.json(
      { error: "Failed to fetch application" },
      { status: 500 }
    );
  }
}
