import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Learning paths - curated sequences of courses for specific goals
const learningPaths = [
  // ===============================
  // GRAPPLING PATHS
  // ===============================
  {
    title: "Complete BJJ Beginner Program",
    slug: "complete-bjj-beginner-program",
    description: `A structured 12-week program designed to take you from complete beginner to a confident white belt.

This learning path guides you through the essential fundamentals of Brazilian Jiu-Jitsu in the optimal order for maximum retention and skill development.

You'll learn:
- All fundamental positions and the hierarchy
- Basic escapes from every bad position
- Your first submissions and when to use them
- How to combine techniques into effective sequences
- Proper sparring etiquette and safety

By the end of this path, you'll have a solid foundation to continue your BJJ journey with confidence.`,
    discipline: "GRAPPLING" as const,
    difficulty: "BEGINNER",
    estimatedWeeks: 12,
    coverImage: null,
    courses: [
      "bjj-fundamentals-first-90-days",
      "closed-guard-essentials",
      "top-control-domination",
    ],
  },
  {
    title: "Guard Player Development",
    slug: "guard-player-development",
    description: `Become a dangerous guard player who sweeps, submits, and frustrates everyone who tries to pass.

This path takes you from basic closed guard to advanced open guard systems, building a complete bottom game.

Path progression:
1. Master closed guard fundamentals
2. Develop open guard skills (DLR, RDLR, Spider, Lasso)
3. Learn guard retention to never get passed
4. Chain submissions together for relentless attacks

Perfect for practitioners who want to develop a fearsome guard game.`,
    discipline: "GRAPPLING" as const,
    difficulty: "INTERMEDIATE",
    estimatedWeeks: 16,
    coverImage: null,
    courses: [
      "closed-guard-essentials",
      "open-guard-mastery",
      "guard-retention-masterclass",
      "submission-chains-combinations",
    ],
  },
  {
    title: "Competition Ready: IBJJF Preparation",
    slug: "competition-ready-ibjjf",
    description: `Everything you need to compete and win at IBJJF tournaments.

This comprehensive path covers technique, strategy, and mental preparation for BJJ competition.

What you'll master:
- High-percentage competition techniques
- IBJJF rules and scoring strategy
- Match pacing and game planning
- Mental preparation and competition mindset
- Weight cutting and pre-competition routines

Designed for practitioners preparing for their first competition or looking to level up their competitive game.`,
    discipline: "GRAPPLING" as const,
    difficulty: "ADVANCED",
    estimatedWeeks: 8,
    coverImage: null,
    courses: [
      "guard-passing-blueprint",
      "back-attack-system",
      "competition-strategy-tactics",
    ],
  },
  {
    title: "No-Gi Specialist",
    slug: "no-gi-specialist",
    description: `Master the specific techniques and strategies that work best without the gi.

No-gi grappling requires different grips, controls, and game plans. This path teaches you everything specific to no-gi competition.

Focus areas:
- No-gi grips and controls (wrist, underhooks, body locks)
- Front headlock and arm-in choke systems
- Leg lock entries and defense
- Wrestling integration for takedowns
- ADCC and submission-only strategy

Essential for MMA practitioners and submission grappling competitors.`,
    discipline: "GRAPPLING" as const,
    difficulty: "INTERMEDIATE",
    estimatedWeeks: 12,
    coverImage: null,
    courses: [
      "no-gi-specific-techniques",
      "wrestling-for-bjj",
      "modern-leg-lock-system",
    ],
  },
  {
    title: "Leg Lock Mastery",
    slug: "leg-lock-mastery",
    description: `Develop a complete leg lock game from entries to finishes.

The leg lock game has revolutionized modern grappling. This path teaches you the complete system used by elite competitors.

You'll learn:
- All leg entanglement positions (ashi, saddle, 50/50)
- Entries from guard, passing, and scrambles
- Inside and outside heel hook mechanics
- Knee bars, toe holds, and calf slicers
- Defensive escapes and injury prevention

From white belt legal ankle locks to advanced heel hooks.`,
    discipline: "GRAPPLING" as const,
    difficulty: "ADVANCED",
    estimatedWeeks: 10,
    coverImage: null,
    courses: [
      "modern-leg-lock-system",
      "no-gi-specific-techniques",
    ],
  },

  // ===============================
  // MMA PATHS
  // ===============================
  {
    title: "MMA Fundamentals Program",
    slug: "mma-fundamentals-program",
    description: `Build a complete MMA foundation covering striking, grappling, and the unique aspects of cage fighting.

This path takes you through all aspects of mixed martial arts in a logical progression.

Program structure:
1. Learn MMA striking fundamentals (adapted from boxing and kickboxing)
2. Develop takedown defense to keep the fight where you want it
3. Master ground and pound for finishing fights from top position

Perfect for anyone starting their MMA journey or martial artists transitioning to MMA.`,
    discipline: "MMA" as const,
    difficulty: "BEGINNER",
    estimatedWeeks: 16,
    coverImage: null,
    courses: [
      "mma-striking-fundamentals",
      "takedown-defense-strikers",
      "ground-and-pound-mastery",
    ],
  },
  {
    title: "Striker's Path to MMA",
    slug: "strikers-path-to-mma",
    description: `For kickboxers and boxers transitioning to MMA - keep the fight standing and finish on the feet.

This path focuses on using your striking advantage while defending the grappling threats unique to MMA.

You'll learn:
- Adapting your striking for MMA (stance, defense vs takedowns)
- Comprehensive takedown defense
- Wall work and clinch fighting
- When and how to engage ground fighting
- Finishing fights with strikes from any position`,
    discipline: "MMA" as const,
    difficulty: "INTERMEDIATE",
    estimatedWeeks: 12,
    coverImage: null,
    courses: [
      "mma-striking-fundamentals",
      "takedown-defense-strikers",
      "ground-and-pound-mastery",
    ],
  },

  // ===============================
  // KICKBOXING PATHS
  // ===============================
  {
    title: "Kickboxing Fundamentals",
    slug: "kickboxing-fundamentals",
    description: `Master the fundamentals of kickboxing from stance to combinations.

This beginner path covers everything you need to start your kickboxing journey with proper technique and understanding.

What you'll learn:
- Proper fighting stance and footwork
- All basic punches with correct mechanics
- Fundamental kicks (teep, roundhouse, low kick)
- Basic defensive techniques
- How to combine strikes into effective combinations

No prior experience required - we start from zero.`,
    discipline: "KICKBOXING" as const,
    difficulty: "BEGINNER",
    estimatedWeeks: 8,
    coverImage: null,
    courses: [
      "kickboxen-einsteiger",
    ],
  },
  {
    title: "Dutch Kickboxing Complete System",
    slug: "dutch-kickboxing-complete",
    description: `Train the aggressive, high-volume Dutch style that made fighters like Badr Hari and Rico Verhoeven legendary.

This path teaches the complete Dutch kickboxing approach - constant pressure, devastating combinations, and leg kicks that end fights.

Focus areas:
- The Dutch stance and forward pressure philosophy
- Punch-kick combination systems
- The low kick as a primary weapon
- Clinch work and dirty boxing
- Conditioning for Dutch-style fighting

For intermediate strikers ready to add Dutch techniques to their game.`,
    discipline: "KICKBOXING" as const,
    difficulty: "INTERMEDIATE",
    estimatedWeeks: 10,
    coverImage: null,
    courses: [
      "dutch-kickboxing-system",
      "muay-thai-clinch-domination",
    ],
  },
  {
    title: "Muay Thai Clinch Specialist",
    slug: "muay-thai-clinch-specialist",
    description: `Master the Thai clinch - the close-range fighting that defines Muay Thai.

The clinch is where Thai fighters dominate. This path teaches you to control, sweep, and finish from the clinch.

You'll master:
- The plum position and neck fighting
- All knee variations (straight, curve, spear)
- Elbows from clinch range
- Sweeps and dumps for points and damage
- Clinch defense and escape

Essential for anyone training Muay Thai rules or wanting to improve close-range fighting.`,
    discipline: "KICKBOXING" as const,
    difficulty: "INTERMEDIATE",
    estimatedWeeks: 6,
    coverImage: null,
    courses: [
      "muay-thai-clinch-domination",
    ],
  },
];

async function main() {
  console.log("Seeding learning paths...");

  for (const pathData of learningPaths) {
    // Check if path already exists
    const existingPath = await prisma.learningPath.findUnique({
      where: { slug: pathData.slug },
    });

    if (existingPath) {
      console.log(`  Skipping existing path: ${pathData.title}`);
      continue;
    }

    // Find the courses for this path
    const courses = await prisma.course.findMany({
      where: {
        slug: {
          in: pathData.courses,
        },
      },
    });

    if (courses.length === 0) {
      console.log(`  No courses found for path: ${pathData.title}, skipping...`);
      continue;
    }

    // Create the learning path
    const learningPath = await prisma.learningPath.create({
      data: {
        title: pathData.title,
        slug: pathData.slug,
        description: pathData.description,
        discipline: pathData.discipline,
        difficulty: pathData.difficulty,
        estimatedWeeks: pathData.estimatedWeeks,
        coverImage: pathData.coverImage,
        isPublished: true,
        items: {
          create: courses.map((course, index) => ({
            courseId: course.id,
            order: index,
            isRequired: true,
          })),
        },
      },
    });

    console.log(`  Created: ${learningPath.title} (${courses.length} courses)`);
  }

  console.log("\nLearning paths seeded successfully!");

  // Show summary
  const allPaths = await prisma.learningPath.findMany({
    include: {
      items: {
        include: {
          course: {
            select: { title: true },
          },
        },
      },
    },
  });

  console.log("\nLearning Path Summary:");
  for (const path of allPaths) {
    console.log(`\n${path.title} (${path.difficulty})`);
    console.log(`  Discipline: ${path.discipline}`);
    console.log(`  Duration: ${path.estimatedWeeks} weeks`);
    console.log("  Courses:");
    for (const item of path.items) {
      console.log(`    ${item.order + 1}. ${item.course.title}`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
