import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export const dynamic = "force-dynamic";

// GET - get all technique tags, optionally filtered by discipline
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const discipline = searchParams.get("discipline");
    const search = searchParams.get("search");

    const where: {
      discipline?: "MMA" | "KICKBOXING" | "GRAPPLING";
      name?: { contains: string; mode: "insensitive" };
    } = {};

    if (discipline && ["MMA", "KICKBOXING", "GRAPPLING"].includes(discipline)) {
      where.discipline = discipline as "MMA" | "KICKBOXING" | "GRAPPLING";
    }

    if (search) {
      where.name = { contains: search, mode: "insensitive" };
    }

    const techniques = await prisma.techniqueTag.findMany({
      where,
      include: {
        _count: {
          select: { lessons: true },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ techniques });
  } catch (error) {
    console.error("Error fetching techniques:", error);
    return NextResponse.json(
      { error: "Failed to fetch techniques" },
      { status: 500 }
    );
  }
}

// POST - create a new technique tag (admin/coach only)
export async function POST(request: Request) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin or coach
    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.role !== "ADMIN" && user.role !== "COACH") {
      return NextResponse.json(
        { error: "Only admins and coaches can create techniques" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, discipline, description } = body;

    if (!name || !discipline) {
      return NextResponse.json(
        { error: "Name and discipline are required" },
        { status: 400 }
      );
    }

    const validDisciplines = ["MMA", "KICKBOXING", "GRAPPLING"];
    if (!validDisciplines.includes(discipline)) {
      return NextResponse.json(
        { error: "Invalid discipline. Must be MMA, KICKBOXING, or GRAPPLING" },
        { status: 400 }
      );
    }

    // Generate unique slug
    let slug = slugify(name);
    let slugExists = await prisma.techniqueTag.findUnique({ where: { slug } });
    let counter = 1;

    while (slugExists) {
      slug = `${slugify(name)}-${counter}`;
      slugExists = await prisma.techniqueTag.findUnique({ where: { slug } });
      counter++;
    }

    // Check if name already exists
    const existingTechnique = await prisma.techniqueTag.findUnique({
      where: { name },
    });

    if (existingTechnique) {
      return NextResponse.json(
        { error: "A technique with this name already exists" },
        { status: 409 }
      );
    }

    const technique = await prisma.techniqueTag.create({
      data: {
        name,
        slug,
        discipline,
        description: description || null,
      },
      include: {
        _count: {
          select: { lessons: true },
        },
      },
    });

    return NextResponse.json({ technique }, { status: 201 });
  } catch (error) {
    console.error("Error creating technique:", error);
    return NextResponse.json(
      { error: "Failed to create technique" },
      { status: 500 }
    );
  }
}
