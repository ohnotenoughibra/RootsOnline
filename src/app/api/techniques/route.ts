import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

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
