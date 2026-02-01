import { PrismaClient, Discipline, Role, CourseStatus, Language } from "@prisma/client";

const prisma = new PrismaClient();

// Real coaches by discipline
const coaches = {
  mma: { firstName: "Lukas", lastName: "Fromm", email: "lukas.fromm@rootsonlineacademy.com" },
  kickboxing: { firstName: "Sebastian", lastName: "Witschela", email: "sebastian.witschela@rootsonlineacademy.com" },
  grappling: { firstName: "Chris", lastName: "Stäringer", email: "chris.staringer@rootsonlineacademy.com" },
  grapplingAlt: { firstName: "Ibrahim", lastName: "Allaoui", email: "ibrahim.allaoui@rootsonlineacademy.com" },
  mmaAlt: { firstName: "Johnny", lastName: "Heigl", email: "johnny.heigl@rootsonlineacademy.com" },
};

async function getOrCreateCoach(coachData: { firstName: string; lastName: string; email: string }) {
  let coach = await prisma.user.findFirst({
    where: { email: coachData.email },
  });

  if (!coach) {
    coach = await prisma.user.create({
      data: {
        clerkId: `coach_${coachData.email.split("@")[0].replace(".", "_")}`,
        email: coachData.email,
        firstName: coachData.firstName,
        lastName: coachData.lastName,
        role: Role.COACH,
        subscriptionStatus: "ACTIVE",
      },
    });
    console.log(`Created coach: ${coachData.firstName} ${coachData.lastName}`);
  }

  return coach;
}

async function main() {
  console.log("Starting seed...");

  // Create coaches
  const mmaCoach = await getOrCreateCoach(coaches.mma);
  const kickboxingCoach = await getOrCreateCoach(coaches.kickboxing);
  const grapplingCoach = await getOrCreateCoach(coaches.grappling);

  // Create sample courses with appropriate coaches
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
      coachId: mmaCoach.id,
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
      coachId: kickboxingCoach.id,
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
      coachId: grapplingCoach.id,
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
    const { modules, coachId, ...courseInfo } = courseData;

    const course = await prisma.course.upsert({
      where: { slug: courseInfo.slug },
      update: { coachId }, // Update coach if course exists
      create: {
        ...courseInfo,
        coachId,
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
  console.log("\nTo seed additional content, run:");
  console.log("  npx tsx prisma/seed-grappling.ts      # Additional grappling courses");
  console.log("  npx tsx prisma/seed-courses.ts        # MMA & Kickboxing courses");
  console.log("  npx tsx prisma/seed-achievements.ts   # Achievements & technique tags");
  console.log("  npx tsx prisma/seed-learning-paths.ts # Curated learning paths");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
