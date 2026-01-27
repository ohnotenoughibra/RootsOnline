import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { getUploadParams } from "@/lib/cloudinary";
import { isCoach } from "@/lib/auth";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is a coach
    const canUpload = await isCoach();

    if (!canUpload) {
      return NextResponse.json(
        { error: "Only coaches can upload videos" },
        { status: 403 }
      );
    }

    // Get upload parameters with signature
    const uploadParams = getUploadParams();

    return NextResponse.json({
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      ...uploadParams,
    });
  } catch (error) {
    console.error("Error getting upload params:", error);
    return NextResponse.json(
      { error: "Failed to get upload parameters" },
      { status: 500 }
    );
  }
}
