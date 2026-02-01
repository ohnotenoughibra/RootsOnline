import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all users who can be coaches (COACH or ADMIN role)
    const coaches = await prisma.user.findMany({
      where: {
        role: { in: ["COACH", "ADMIN"] },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
      },
      orderBy: { firstName: "asc" },
    });

    return NextResponse.json({ coaches });
  } catch (error) {
    console.error("Error fetching coaches:", error);
    return NextResponse.json(
      { error: "Failed to fetch coaches" },
      { status: 500 }
    );
  }
}
