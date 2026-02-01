import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const certification = await prisma.instructorCertification.findUnique({
      where: { slug, isActive: true },
    });

    if (!certification) {
      return NextResponse.json(
        { error: "Certification not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ certification });
  } catch (error) {
    console.error("Error fetching certification:", error);
    return NextResponse.json(
      { error: "Failed to fetch certification" },
      { status: 500 }
    );
  }
}
