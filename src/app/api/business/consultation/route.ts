import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, gymName, phone, message } = body;

    // Validate required fields
    if (!name || !email || !gymName || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Create consultation request
    const consultation = await prisma.consultationRequest.create({
      data: {
        name,
        email,
        gymName,
        phone: phone || null,
        message,
        status: "PENDING",
      },
    });

    // TODO: Send notification email to admin
    // TODO: Send confirmation email to user

    return NextResponse.json(
      {
        success: true,
        message: "Consultation request submitted successfully",
        id: consultation.id
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating consultation request:", error);
    return NextResponse.json(
      { error: "Failed to submit consultation request" },
      { status: 500 }
    );
  }
}

// GET - List consultation requests (admin only)
export async function GET(request: NextRequest) {
  try {
    // TODO: Add admin authentication check

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const consultations = await prisma.consultationRequest.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ consultations });
  } catch (error) {
    console.error("Error fetching consultation requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch consultation requests" },
      { status: 500 }
    );
  }
}
