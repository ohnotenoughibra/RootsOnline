import { jsPDF } from "jspdf";

interface CertificateData {
  studentName: string;
  courseTitle: string;
  coachName: string;
  certificateNumber: string;
  completedAt: Date;
  discipline: string;
}

/**
 * Generates a professional PDF certificate for course completion
 */
export function generateCertificatePDF(data: CertificateData): jsPDF {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Background gradient effect using rectangles
  doc.setFillColor(24, 24, 27); // zinc-900
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // Decorative border
  doc.setDrawColor(202, 138, 4); // yellow-600 (gold)
  doc.setLineWidth(2);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20, "S");

  // Inner border
  doc.setLineWidth(0.5);
  doc.rect(15, 15, pageWidth - 30, pageHeight - 30, "S");

  // Corner decorations
  const corners = [
    [20, 20],
    [pageWidth - 20, 20],
    [20, pageHeight - 20],
    [pageWidth - 20, pageHeight - 20],
  ];
  doc.setFillColor(202, 138, 4);
  corners.forEach(([x, y]) => {
    doc.circle(x, y, 3, "F");
  });

  // Title
  doc.setTextColor(202, 138, 4);
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.text("ROOTS ONLINE ACADEMY", pageWidth / 2, 35, { align: "center" });

  // Certificate text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(36);
  doc.setFont("helvetica", "bold");
  doc.text("CERTIFICATE", pageWidth / 2, 55, { align: "center" });

  doc.setFontSize(16);
  doc.setFont("helvetica", "normal");
  doc.text("OF COMPLETION", pageWidth / 2, 65, { align: "center" });

  // Discipline badge
  doc.setFillColor(153, 27, 27); // red-800
  const badgeWidth = 40;
  doc.roundedRect(
    pageWidth / 2 - badgeWidth / 2,
    72,
    badgeWidth,
    8,
    2,
    2,
    "F"
  );
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text(data.discipline.toUpperCase(), pageWidth / 2, 78, { align: "center" });

  // This certifies text
  doc.setTextColor(156, 163, 175); // gray-400
  doc.setFontSize(12);
  doc.text("This is to certify that", pageWidth / 2, 95, { align: "center" });

  // Student name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.text(data.studentName, pageWidth / 2, 110, { align: "center" });

  // Decorative line under name
  doc.setDrawColor(202, 138, 4);
  doc.setLineWidth(0.5);
  doc.line(pageWidth / 2 - 60, 115, pageWidth / 2 + 60, 115);

  // Completion text
  doc.setTextColor(156, 163, 175);
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("has successfully completed the course", pageWidth / 2, 128, {
    align: "center",
  });

  // Course title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text(data.courseTitle, pageWidth / 2, 142, { align: "center" });

  // Instructor
  doc.setTextColor(156, 163, 175);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(`Instructed by ${data.coachName}`, pageWidth / 2, 155, {
    align: "center",
  });

  // Date and certificate number
  const completionDate = data.completedAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  doc.setFontSize(10);
  doc.text(`Completed on ${completionDate}`, pageWidth / 2 - 50, 175, {
    align: "center",
  });
  doc.text(`Certificate No: ${data.certificateNumber}`, pageWidth / 2 + 50, 175, {
    align: "center",
  });

  // Footer
  doc.setTextColor(113, 113, 122); // zinc-500
  doc.setFontSize(8);
  doc.text(
    "Verify this certificate at rootsonlineacademy.com/verify",
    pageWidth / 2,
    pageHeight - 20,
    { align: "center" }
  );

  return doc;
}

/**
 * Generates certificate PDF as base64 string
 */
export function generateCertificateBase64(data: CertificateData): string {
  const doc = generateCertificatePDF(data);
  return doc.output("datauristring");
}

/**
 * Generates certificate PDF as Blob
 */
export function generateCertificateBlob(data: CertificateData): Blob {
  const doc = generateCertificatePDF(data);
  return doc.output("blob");
}
