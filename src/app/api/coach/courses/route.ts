import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";
import { isCoach } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const canCreate = await isCoach();
    if (!canCreate) {
      return NextResponse.json(
        { error: "Only coaches can create courses" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, description, shortDescription, discipline } = body;

    if (!title || !description || !discipline) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate unique slug
    let slug = slugify(title);
    let slugExists = await prisma.course.findUnique({ where: { slug } });
    let counter = 1;

    while (slugExists) {
      slug = `${slugify(title)}-${counter}`;
      slugExists = await prisma.course.findUnique({ where: { slug } });
      counter++;
    }

    // Create course
    const course = await prisma.course.create({
      data: {
        title,
        slug,
        description,
        shortDescription: shortDescription || null,
        discipline,
        coachId: user.id,
        status: "DRAFT",
      },
    });

    return NextResponse.json({ course }, { status: 201 });
  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 }
    );
  }
}
