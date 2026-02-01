import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { generateSignedVideoUrl } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { hasActiveSubscription } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { lessonId, publicId } = body;

    if (!lessonId || !publicId) {
      return NextResponse.json(
        { error: "Missing lessonId or publicId" },
        { status: 400 }
      );
    }

    // Check if lesson exists and get its details
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!lesson) {
      return NextResponse.json(
        { error: "Lesson not found" },
        { status: 404 }
      );
    }

    // Check if user can access this content
    const isSubscribed = await hasActiveSubscription();

    // If lesson is not free preview and user is not subscribed, deny access
    if (!lesson.isFreePreview && !isSubscribed) {
      return NextResponse.json(
        { error: "Subscription required" },
        { status: 403 }
      );
    }

    // Generate signed URL (valid for 1 hour)
    const signedUrl = generateSignedVideoUrl(publicId, 3600);

    if (!signedUrl) {
      return NextResponse.json(
        { error: "Failed to generate video URL. Cloudinary may not be configured." },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: signedUrl });
  } catch (error) {
    console.error("Error signing video URL:", error);
    return NextResponse.json(
      { error: "Failed to sign video URL" },
      { status: 500 }
    );
  }
}
