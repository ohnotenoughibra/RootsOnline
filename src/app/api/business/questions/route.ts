import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const validCategories = [
  "GYM_OPERATIONS",
  "MARKETING",
  "EVENTS",
  "COMMUNITY",
  "FINANCE",
  "LEGAL",
  "STAFFING",
  "FACILITIES",
  "TECHNOLOGY",
  "GROWTH",
];

// GET - List questions
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "20");

    const where: Record<string, unknown> = {};

    if (category && validCategories.includes(category)) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ];
    }

    const questions = await prisma.businessQuestion.findMany({
      where,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            imageUrl: true,
            role: true,
          },
        },
        _count: {
          select: { answers: true },
        },
      },
      orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
      take: limit,
    });

    return NextResponse.json({ questions });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}

// POST - Create question
export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    const { title, content, category } = body;

    if (!title?.trim() || !content?.trim() || !category) {
      return NextResponse.json(
        { error: "Title, content, and category are required" },
        { status: 400 }
      );
    }

    if (!validCategories.includes(category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    const question = await prisma.businessQuestion.create({
      data: {
        userId: user.id,
        title: title.trim(),
        content: content.trim(),
        category,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json({ question });
  } catch (error) {
    console.error("Error creating question:", error);
    return NextResponse.json(
      { error: "Failed to create question" },
      { status: 500 }
    );
  }
}
