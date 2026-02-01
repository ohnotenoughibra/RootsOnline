import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export const dynamic = "force-dynamic";

// GET - get a technique with its associated lessons
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const technique = await prisma.techniqueTag.findUnique({
      where: { slug },
      include: {
        lessons: {
          include: {
            lesson: {
              include: {
                module: {
                  include: {
                    course: {
                      select: {
                        id: true,
                        title: true,
                        slug: true,
                        discipline: true,
                        thumbnailUrl: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        _count: {
          select: { lessons: true },
        },
      },
    });

    if (!technique) {
      return NextResponse.json(
        { error: "Technique not found" },
        { status: 404 }
      );
    }

    // Transform the data to a cleaner format
    const lessons = technique.lessons.map((lt) => ({
      id: lt.lesson.id,
      title: lt.lesson.title,
      description: lt.lesson.description,
      videoDuration: lt.lesson.videoDuration,
      isFreePreview: lt.lesson.isFreePreview,
      isPublished: lt.lesson.isPublished,
      module: {
        id: lt.lesson.module.id,
        title: lt.lesson.module.title,
      },
      course: {
        id: lt.lesson.module.course.id,
        title: lt.lesson.module.course.title,
        slug: lt.lesson.module.course.slug,
        discipline: lt.lesson.module.course.discipline,
        thumbnailUrl: lt.lesson.module.course.thumbnailUrl,
      },
      taggedAt: lt.createdAt,
    }));

    return NextResponse.json({
      technique: {
        id: technique.id,
        name: technique.name,
        slug: technique.slug,
        discipline: technique.discipline,
        description: technique.description,
        lessonCount: technique._count.lessons,
        createdAt: technique.createdAt,
      },
      lessons,
    });
  } catch (error) {
    console.error("Error fetching technique:", error);
    return NextResponse.json(
      { error: "Failed to fetch technique" },
      { status: 500 }
    );
  }
}

// PATCH - update a technique (admin only)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { userId: clerkId } = await auth();
    const { slug } = await params;

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admins can update techniques" },
        { status: 403 }
      );
    }

    // Find the technique
    const existingTechnique = await prisma.techniqueTag.findUnique({
      where: { slug },
    });

    if (!existingTechnique) {
      return NextResponse.json(
        { error: "Technique not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name, discipline, description } = body;

    const updateData: {
      name?: string;
      slug?: string;
      discipline?: "MMA" | "KICKBOXING" | "GRAPPLING";
      description?: string | null;
    } = {};

    // Handle name update (also update slug)
    if (name && name !== existingTechnique.name) {
      // Check if new name already exists
      const nameExists = await prisma.techniqueTag.findUnique({
        where: { name },
      });

      if (nameExists) {
        return NextResponse.json(
          { error: "A technique with this name already exists" },
          { status: 409 }
        );
      }

      updateData.name = name;

      // Generate new unique slug
      let newSlug = slugify(name);
      let slugExists = await prisma.techniqueTag.findFirst({
        where: { slug: newSlug, id: { not: existingTechnique.id } },
      });
      let counter = 1;

      while (slugExists) {
        newSlug = `${slugify(name)}-${counter}`;
        slugExists = await prisma.techniqueTag.findFirst({
          where: { slug: newSlug, id: { not: existingTechnique.id } },
        });
        counter++;
      }

      updateData.slug = newSlug;
    }

    // Handle discipline update
    if (discipline) {
      const validDisciplines = ["MMA", "KICKBOXING", "GRAPPLING"];
      if (!validDisciplines.includes(discipline)) {
        return NextResponse.json(
          { error: "Invalid discipline. Must be MMA, KICKBOXING, or GRAPPLING" },
          { status: 400 }
        );
      }
      updateData.discipline = discipline;
    }

    // Handle description update
    if (description !== undefined) {
      updateData.description = description || null;
    }

    const technique = await prisma.techniqueTag.update({
      where: { id: existingTechnique.id },
      data: updateData,
      include: {
        _count: {
          select: { lessons: true },
        },
      },
    });

    return NextResponse.json({ technique });
  } catch (error) {
    console.error("Error updating technique:", error);
    return NextResponse.json(
      { error: "Failed to update technique" },
      { status: 500 }
    );
  }
}

// DELETE - delete a technique (admin only)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { userId: clerkId } = await auth();
    const { slug } = await params;

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admins can delete techniques" },
        { status: 403 }
      );
    }

    // Find the technique
    const technique = await prisma.techniqueTag.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { lessons: true },
        },
      },
    });

    if (!technique) {
      return NextResponse.json(
        { error: "Technique not found" },
        { status: 404 }
      );
    }

    // Delete the technique (LessonTag entries will cascade delete)
    await prisma.techniqueTag.delete({
      where: { id: technique.id },
    });

    return NextResponse.json({
      success: true,
      message: `Technique "${technique.name}" deleted successfully`,
      removedTagsCount: technique._count.lessons,
    });
  } catch (error) {
    console.error("Error deleting technique:", error);
    return NextResponse.json(
      { error: "Failed to delete technique" },
      { status: 500 }
    );
  }
}
