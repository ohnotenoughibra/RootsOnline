import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

// GET - get user's belts for all disciplines
export async function GET() {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const belts = await prisma.userBelt.findMany({
      where: { userId: user.id },
      orderBy: { discipline: "asc" },
    });

    // Return belts with defaults for disciplines without belts
    const disciplines = ["MMA", "KICKBOXING", "GRAPPLING"] as const;
    const beltMap = new Map(belts.map((b) => [b.discipline, b]));

    const allBelts = disciplines.map((discipline) => {
      const belt = beltMap.get(discipline);
      return (
        belt || {
          discipline,
          belt: "WHITE",
          stripes: 0,
          awardedAt: null,
        }
      );
    });

    return NextResponse.json({ belts: allBelts });
  } catch (error) {
    console.error("Error fetching belts:", error);
    return NextResponse.json(
      { error: "Failed to fetch belts" },
      { status: 500 }
    );
  }
}
