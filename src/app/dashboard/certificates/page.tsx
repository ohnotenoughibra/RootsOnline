"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Award, Loader2, Download, Share2 } from "lucide-react";
import { toast } from "sonner";
import { jsPDF } from "jspdf";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Certificate {
  id: string;
  certificateNumber: string;
  completedAt: string;
  course: {
    id: string;
    title: string;
    slug: string;
    coverImage: string | null;
    discipline: string;
    coach: {
      firstName: string | null;
      lastName: string | null;
    };
  };
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertificates();
  }, []);

  async function fetchCertificates() {
    try {
      const response = await fetch("/api/certificates");
      if (response.ok) {
        const data = await response.json();
        setCertificates(data);
      }
    } catch (error) {
      console.error("Error fetching certificates:", error);
      toast.error("Failed to load certificates");
    } finally {
      setLoading(false);
    }
  }

  function shareCertificate(cert: Certificate) {
    const url = `${window.location.origin}/certificates/${cert.certificateNumber}`;
    navigator.clipboard.writeText(url);
    toast.success("Certificate link copied to clipboard!");
  }

  function downloadCertificate(cert: Certificate) {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Background
    doc.setFillColor(250, 250, 250);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    // Border
    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(2);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

    // Inner border
    doc.setLineWidth(0.5);
    doc.rect(15, 15, pageWidth - 30, pageHeight - 30);

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(36);
    doc.setTextColor(30, 30, 30);
    doc.text("Certificate of Completion", pageWidth / 2, 50, { align: "center" });

    // Subtitle
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text("Roots Online Academy", pageWidth / 2, 62, { align: "center" });

    // Decorative line
    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(1);
    doc.line(pageWidth / 2 - 50, 70, pageWidth / 2 + 50, 70);

    // "This certifies that" text
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    doc.text("This certifies that", pageWidth / 2, 85, { align: "center" });

    // Student name placeholder
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(30, 30, 30);
    doc.text("Student", pageWidth / 2, 100, { align: "center" });

    // "has successfully completed" text
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    doc.text("has successfully completed", pageWidth / 2, 115, { align: "center" });

    // Course title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(59, 130, 246);
    doc.text(cert.course.title, pageWidth / 2, 130, { align: "center" });

    // Instructor
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    doc.text(
      `Instructed by ${cert.course.coach.firstName} ${cert.course.coach.lastName}`,
      pageWidth / 2,
      145,
      { align: "center" }
    );

    // Date
    const completedDate = new Date(cert.completedAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    doc.text(`Completed on ${completedDate}`, pageWidth / 2, 160, { align: "center" });

    // Certificate number
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(`Certificate ID: ${cert.certificateNumber}`, pageWidth / 2, pageHeight - 25, {
      align: "center",
    });

    // Save PDF
    doc.save(`certificate-${cert.certificateNumber}.pdf`);
    toast.success("Certificate downloaded!");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <Award className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">My Certificates</h1>
        </div>

        {certificates.length === 0 ? (
          <Card className="p-12 text-center">
            <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No certificates yet</h2>
            <p className="text-muted-foreground mb-4">
              Complete all lessons in a course to earn a certificate.
            </p>
            <Link href="/courses">
              <Button>Browse Courses</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {certificates.map((cert) => (
              <Card key={cert.id} className="overflow-hidden">
                {cert.course.coverImage && (
                  <div className="relative h-32 w-full">
                    <Image
                      src={cert.course.coverImage}
                      alt={cert.course.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <Badge variant="secondary">{cert.course.discipline}</Badge>
                    </div>
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Award className="h-6 w-6 text-yellow-500 shrink-0" />
                    <Badge variant="outline" className="text-xs">
                      #{cert.certificateNumber}
                    </Badge>
                  </div>
                  <h3 className="font-semibold mb-1">{cert.course.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Instructor: {cert.course.coach.firstName} {cert.course.coach.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Completed {new Date(cert.completedAt).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => shareCertificate(cert)}
                    >
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                    <Button
                      size="sm"
                      variant="default"
                      className="flex-1"
                      onClick={() => downloadCertificate(cert)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      PDF
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
