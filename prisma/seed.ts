import { PrismaClient, Discipline, Role, CourseStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  // Create a demo coach user
  const coach = await prisma.user.upsert({
    where: { email: "coach@roa.demo" },
    update: {},
    create: {
      clerkId: "demo_coach_clerk_id",
      email: "coach@roa.demo",
      firstName: "John",
      lastName: "Champion",
      role: Role.COACH,
      subscriptionStatus: "ACTIVE",
    },
  });

  console.log("Created coach:", coach.email);

  // Create sample courses
  const courses = [
    {
      title: "Complete MMA Fundamentals",
      slug: "complete-mma-fundamentals",
      description: `This comprehensive MMA course covers everything you need to know to start your mixed martial arts journey. From basic stances and footwork to combining striking and grappling, you'll learn the fundamentals that every fighter needs.

Topics covered:
- Fighting stance and movement
- Basic punches: jab, cross, hook, uppercut
- Kicks: teep, roundhouse, low kick
- Clinch work basics
- Takedown defense
- Ground survival
- Combining techniques

Perfect for beginners looking to build a solid foundation in MMA.`,
      shortDescription: "Master the fundamentals of mixed martial arts from scratch",
      discipline: Discipline.MMA,
      modules: [
        {
          title: "Fighting Stance & Movement",
          lessons: [
            { title: "The Basic Fighting Stance", isFreePreview: true },
            { title: "Footwork Fundamentals" },
            { title: "Angles and Pivoting" },
          ],
        },
        {
          title: "Striking Fundamentals",
          lessons: [
            { title: "The Jab", isFreePreview: true },
            { title: "The Cross" },
            { title: "Hooks and Uppercuts" },
            { title: "Basic Combinations" },
          ],
        },
        {
          title: "Kick Basics",
          lessons: [
            { title: "The Teep (Push Kick)" },
            { title: "Low Kicks" },
            { title: "Roundhouse Kick" },
          ],
        },
      ],
    },
    {
      title: "Advanced Kickboxing Techniques",
      slug: "advanced-kickboxing-techniques",
      description: `Take your striking to the next level with this advanced kickboxing course. Learn sophisticated combinations, defensive techniques, and ring generalship from a seasoned professional.

This course is designed for intermediate to advanced strikers who want to refine their technique and add new weapons to their arsenal.

What you'll learn:
- Advanced footwork patterns
- Complex combinations
- Counter-striking strategies
- Defensive head movement
- Body shot setups
- Fighting at range vs. in the pocket`,
      shortDescription: "Elevate your striking game with advanced kickboxing techniques",
      discipline: Discipline.KICKBOXING,
      modules: [
        {
          title: "Advanced Footwork",
          lessons: [
            { title: "Lateral Movement Mastery", isFreePreview: true },
            { title: "Creating Angles" },
            { title: "In-and-Out Fighting" },
          ],
        },
        {
          title: "Counter-Striking",
          lessons: [
            { title: "Slip and Counter" },
            { title: "Pull Counter Techniques" },
            { title: "Check Hook Mastery" },
          ],
        },
      ],
    },
    {
      title: "No-Gi Grappling Essentials",
      slug: "no-gi-grappling-essentials",
      description: `Master the art of no-gi grappling with this comprehensive course. Learn effective takedowns, guard passes, sweeps, and submissions that work without the gi.

Perfect for MMA fighters and submission grapplers who want to improve their ground game.

Course highlights:
- Wrestling-based takedowns
- Guard passing systems
- Submission chains
- Escapes and reversals
- Positional control
- Competition strategies`,
      shortDescription: "Essential no-gi techniques for grapplers and MMA fighters",
      discipline: Discipline.GRAPPLING,
      modules: [
        {
          title: "Takedown Fundamentals",
          lessons: [
            { title: "Double Leg Takedown", isFreePreview: true },
            { title: "Single Leg Variations" },
            { title: "Body Lock Takedowns" },
          ],
        },
        {
          title: "Guard Passing",
          lessons: [
            { title: "Pressure Passing Basics" },
            { title: "Leg Weave Pass" },
            { title: "Over-Under Pass" },
          ],
        },
        {
          title: "Submissions",
          lessons: [
            { title: "Rear Naked Choke" },
            { title: "Guillotine System" },
            { title: "Arm Triangle" },
          ],
        },
      ],
    },
  ];

  for (const courseData of courses) {
    const { modules, ...courseInfo } = courseData;

    const course = await prisma.course.upsert({
      where: { slug: courseInfo.slug },
      update: {},
      create: {
        ...courseInfo,
        coachId: coach.id,
        status: CourseStatus.PUBLISHED,
        featured: true,
        publishedAt: new Date(),
      },
    });

    console.log("Created course:", course.title);

    // Create modules and lessons
    for (let moduleIndex = 0; moduleIndex < modules.length; moduleIndex++) {
      const moduleData = modules[moduleIndex];

      const existingModule = await prisma.module.findFirst({
        where: {
          courseId: course.id,
          title: moduleData.title,
        },
      });

      if (existingModule) {
        console.log("Module already exists:", moduleData.title);
        continue;
      }

      const module = await prisma.module.create({
        data: {
          title: moduleData.title,
          order: moduleIndex,
          courseId: course.id,
        },
      });

      console.log("  Created module:", module.title);

      // Create lessons
      for (let lessonIndex = 0; lessonIndex < moduleData.lessons.length; lessonIndex++) {
        const lessonData = moduleData.lessons[lessonIndex];

        await prisma.lesson.create({
          data: {
            title: lessonData.title,
            order: lessonIndex,
            isFreePreview: lessonData.isFreePreview || false,
            isPublished: true,
            moduleId: module.id,
            // Demo video duration (random between 5-15 minutes)
            videoDuration: Math.floor(Math.random() * 600) + 300,
          },
        });

        console.log("    Created lesson:", lessonData.title);
      }
    }
  }

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
