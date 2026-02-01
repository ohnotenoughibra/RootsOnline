import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Comprehensive Grappling Curriculum
// Organized by difficulty level with progressive learning paths

export const grapplingCurriculum = {
  // ===================
  // BEGINNER LEVEL
  // ===================
  beginnerCourses: [
    {
      title: "BJJ Fundamentals: Your First 90 Days",
      slug: "bjj-fundamentals-first-90-days",
      description: `Master the essential foundations of Brazilian Jiu-Jitsu in this comprehensive beginner course.

You'll learn the core positions, basic submissions, and fundamental escapes that form the building blocks of your grappling journey. This course is designed for complete beginners with no prior experience.

What you'll learn:
- The 6 fundamental positions of BJJ
- Basic submissions from each position
- Essential escapes and defensive postures
- Proper breathing and relaxation under pressure
- Training etiquette and safety protocols`,
      shortDescription: "Master BJJ basics: positions, submissions, and escapes for complete beginners.",
      discipline: "GRAPPLING",
      language: "EN",
      modules: [
        {
          title: "Understanding Positions",
          description: "Learn the hierarchy of positions and why position matters before submission",
          order: 1,
          lessons: [
            { title: "The Position Hierarchy Explained", duration: 720, order: 1 },
            { title: "Closed Guard - Your Safe Space", duration: 840, order: 2 },
            { title: "Mount - The Dominant Position", duration: 780, order: 3 },
            { title: "Side Control Fundamentals", duration: 810, order: 4 },
            { title: "Back Control - The Ultimate Position", duration: 750, order: 5 },
          ],
        },
        {
          title: "Essential Escapes",
          description: "Never feel trapped again with these fundamental escapes",
          order: 2,
          lessons: [
            { title: "The Bridge & Roll (Upa) Escape", duration: 660, order: 1 },
            { title: "Elbow-Knee Escape from Mount", duration: 720, order: 2 },
            { title: "Side Control Escape to Guard", duration: 780, order: 3 },
            { title: "Turtle Defense & Recovery", duration: 690, order: 4 },
            { title: "Back Escape Fundamentals", duration: 840, order: 5 },
          ],
        },
        {
          title: "Your First Submissions",
          description: "Learn high-percentage submissions that work at all levels",
          order: 3,
          lessons: [
            { title: "The Americana from Mount", duration: 600, order: 1 },
            { title: "Cross Collar Choke from Mount", duration: 720, order: 2 },
            { title: "Armbar from Closed Guard", duration: 840, order: 3 },
            { title: "Triangle Choke Introduction", duration: 900, order: 4 },
            { title: "Rear Naked Choke Basics", duration: 660, order: 5 },
          ],
        },
        {
          title: "Putting It Together",
          description: "Combine positions, escapes, and submissions into flowing sequences",
          order: 4,
          lessons: [
            { title: "Linking Guard Attacks", duration: 780, order: 1 },
            { title: "Mount Attack Combinations", duration: 720, order: 2 },
            { title: "Defensive to Offensive Transitions", duration: 840, order: 3 },
            { title: "Sparring Strategy for Beginners", duration: 900, order: 4 },
          ],
        },
      ],
    },
    {
      title: "Closed Guard Essentials",
      slug: "closed-guard-essentials",
      description: `The closed guard is your home base in BJJ - a position where you can attack, sweep, and stay safe even against larger opponents.

This course breaks down everything you need to know about playing an effective closed guard game, from basic controls to high-percentage attacks.

You'll master:
- Proper closed guard posture and grips
- Breaking your opponent's posture
- The hip bump sweep
- Scissor sweep variations
- Armbar, triangle, and omoplata attacks
- Defending against guard passes`,
      shortDescription: "Build a dangerous closed guard game with sweeps, submissions, and retention.",
      discipline: "GRAPPLING",
      language: "EN",
      modules: [
        {
          title: "Guard Control Fundamentals",
          description: "Control your opponent before attacking",
          order: 1,
          lessons: [
            { title: "Proper Closed Guard Posture", duration: 600, order: 1 },
            { title: "Essential Grips & Grip Fighting", duration: 720, order: 2 },
            { title: "Breaking Posture Techniques", duration: 780, order: 3 },
            { title: "Hip Movement in Guard", duration: 660, order: 4 },
          ],
        },
        {
          title: "Sweep Game",
          description: "Get on top with these fundamental sweeps",
          order: 2,
          lessons: [
            { title: "Hip Bump Sweep Masterclass", duration: 840, order: 1 },
            { title: "Scissor Sweep & Variations", duration: 900, order: 2 },
            { title: "Flower Sweep (Pendulum)", duration: 720, order: 3 },
            { title: "Combining Sweeps & Attacks", duration: 780, order: 4 },
          ],
        },
        {
          title: "Submission Attacks",
          description: "Finish the fight from your back",
          order: 3,
          lessons: [
            { title: "Armbar from Guard - Deep Dive", duration: 900, order: 1 },
            { title: "Triangle Choke Mechanics", duration: 960, order: 2 },
            { title: "Omoplata Setup & Finish", duration: 840, order: 3 },
            { title: "Cross Choke from Guard", duration: 720, order: 4 },
            { title: "The Kimura Trap System", duration: 780, order: 5 },
          ],
        },
      ],
    },
    {
      title: "Top Control Domination",
      slug: "top-control-domination",
      description: `Learn to maintain crushing top pressure and control that makes your opponents feel helpless.

This course teaches you the secrets of pressure passing and dominant top control that will frustrate even experienced grapplers.

Course highlights:
- Side control pressure and submissions
- Mount maintenance and attacks
- Knee on belly control
- North-south position
- Transitioning between top positions`,
      shortDescription: "Master side control, mount, and knee on belly for crushing top pressure.",
      discipline: "GRAPPLING",
      language: "EN",
      modules: [
        {
          title: "Side Control Mastery",
          description: "The most versatile top position",
          order: 1,
          lessons: [
            { title: "Heavy Side Control Fundamentals", duration: 720, order: 1 },
            { title: "Crossface & Underhook Control", duration: 660, order: 2 },
            { title: "Kesa Gatame (Scarf Hold)", duration: 600, order: 3 },
            { title: "North-South Position", duration: 720, order: 4 },
            { title: "Side Control Submissions", duration: 840, order: 5 },
          ],
        },
        {
          title: "Mount Dominance",
          description: "The king of positions",
          order: 2,
          lessons: [
            { title: "Low Mount vs High Mount", duration: 660, order: 1 },
            { title: "Maintaining Mount Against Escapes", duration: 780, order: 2 },
            { title: "S-Mount & Technical Mount", duration: 720, order: 3 },
            { title: "Mount Submission Attacks", duration: 900, order: 4 },
          ],
        },
        {
          title: "Knee on Belly",
          description: "The most demoralizing position",
          order: 3,
          lessons: [
            { title: "Knee on Belly Basics", duration: 600, order: 1 },
            { title: "Maintaining KOB Pressure", duration: 660, order: 2 },
            { title: "KOB to Mount Transitions", duration: 720, order: 3 },
            { title: "Submissions from KOB", duration: 780, order: 4 },
          ],
        },
      ],
    },
  ],

  // ===================
  // INTERMEDIATE LEVEL
  // ===================
  intermediateCourses: [
    {
      title: "Guard Passing Blueprint",
      slug: "guard-passing-blueprint",
      description: `A systematic approach to passing any guard you encounter.

This course covers the three main passing styles - pressure, speed, and trickery - giving you tools to deal with any guard player.

You'll learn:
- Toreando (bullfighter) passes
- Knee cut passing system
- Leg drag mechanics
- Stack passes for closed guard
- Dealing with grips and frames
- Combining passes into sequences`,
      shortDescription: "Systematic guard passing: toreando, knee cut, leg drag, and stack passes.",
      discipline: "GRAPPLING",
      language: "EN",
      modules: [
        {
          title: "Passing Fundamentals",
          description: "Core concepts that apply to all passing",
          order: 1,
          lessons: [
            { title: "Guard Passing Philosophy", duration: 600, order: 1 },
            { title: "Posture & Base When Passing", duration: 720, order: 2 },
            { title: "Dealing with Grips", duration: 780, order: 3 },
            { title: "Understanding Guard Retention", duration: 660, order: 4 },
          ],
        },
        {
          title: "Speed Passing",
          description: "Quick passes that don't allow your opponent to settle",
          order: 2,
          lessons: [
            { title: "Toreando Pass Fundamentals", duration: 840, order: 1 },
            { title: "Toreando Variations & Counters", duration: 900, order: 2 },
            { title: "X-Pass Mechanics", duration: 720, order: 3 },
            { title: "Long Step Pass", duration: 780, order: 4 },
          ],
        },
        {
          title: "Pressure Passing",
          description: "Slow, methodical passes that smother your opponent",
          order: 3,
          lessons: [
            { title: "Knee Cut Pass Deep Dive", duration: 960, order: 1 },
            { title: "Leg Drag System", duration: 900, order: 2 },
            { title: "Over-Under Pass", duration: 840, order: 3 },
            { title: "Double Under Stack Pass", duration: 780, order: 4 },
          ],
        },
        {
          title: "Combining Your Passes",
          description: "Chain passes together for unstoppable sequences",
          order: 4,
          lessons: [
            { title: "Speed to Pressure Combinations", duration: 780, order: 1 },
            { title: "Dealing with Inversions", duration: 720, order: 2 },
            { title: "Passing Open Guards", duration: 840, order: 3 },
            { title: "Complete Passing Gameplan", duration: 900, order: 4 },
          ],
        },
      ],
    },
    {
      title: "Open Guard Mastery",
      slug: "open-guard-mastery",
      description: `Develop a complete open guard game that keeps your opponent guessing.

Modern BJJ requires proficiency in multiple open guards. This course teaches you the most effective open guards and how to link them together.

Guards covered:
- De La Riva (DLR)
- Reverse De La Riva (RDLR)
- Spider Guard
- Lasso Guard
- Collar-Sleeve Guard
- Single Leg X (SLX)`,
      shortDescription: "Master DLR, RDLR, spider, and lasso guards for a complete open guard game.",
      discipline: "GRAPPLING",
      language: "EN",
      modules: [
        {
          title: "De La Riva Guard",
          description: "The foundation of modern open guard",
          order: 1,
          lessons: [
            { title: "DLR Hook & Grips", duration: 720, order: 1 },
            { title: "Basic DLR Sweeps", duration: 840, order: 2 },
            { title: "DLR to Back Takes", duration: 780, order: 3 },
            { title: "Berimbolo Introduction", duration: 900, order: 4 },
            { title: "DLR Retention", duration: 660, order: 5 },
          ],
        },
        {
          title: "Reverse De La Riva",
          description: "Control the nearside for powerful sweeps",
          order: 2,
          lessons: [
            { title: "RDLR Fundamentals", duration: 720, order: 1 },
            { title: "Kiss of the Dragon", duration: 780, order: 2 },
            { title: "RDLR Sweeps", duration: 840, order: 3 },
            { title: "Linking DLR & RDLR", duration: 720, order: 4 },
          ],
        },
        {
          title: "Spider & Lasso Guards",
          description: "Distance management guards",
          order: 3,
          lessons: [
            { title: "Spider Guard Fundamentals", duration: 720, order: 1 },
            { title: "Spider Sweeps & Triangles", duration: 840, order: 2 },
            { title: "Lasso Guard Setup", duration: 660, order: 3 },
            { title: "Lasso Omoplata & Sweeps", duration: 780, order: 4 },
            { title: "Combining Spider & Lasso", duration: 720, order: 5 },
          ],
        },
        {
          title: "Building Your System",
          description: "Link all guards into a cohesive game",
          order: 4,
          lessons: [
            { title: "Guard Transitions Flow", duration: 780, order: 1 },
            { title: "Collar-Sleeve Integration", duration: 720, order: 2 },
            { title: "Single Leg X Entries", duration: 840, order: 3 },
            { title: "Creating Your Guard System", duration: 900, order: 4 },
          ],
        },
      ],
    },
    {
      title: "Submission Chains & Combinations",
      slug: "submission-chains-combinations",
      description: `Stop hunting for single submissions. Learn to chain attacks together so when one fails, another is already waiting.

This course teaches you systematic attack sequences from every major position.

Submission chains covered:
- Arm attack chains (americana → kimura → armbar)
- Triangle → armbar → omoplata
- Back attack chains
- Mount attack flows
- Guillotine systems`,
      shortDescription: "Chain submissions together for relentless attacks that catch everyone.",
      discipline: "GRAPPLING",
      language: "EN",
      modules: [
        {
          title: "Understanding Attack Chains",
          description: "The philosophy of combination attacks",
          order: 1,
          lessons: [
            { title: "Why Single Attacks Fail", duration: 600, order: 1 },
            { title: "Reading Defensive Reactions", duration: 720, order: 2 },
            { title: "Building Your Attack Trees", duration: 780, order: 3 },
          ],
        },
        {
          title: "Guard Attack Chains",
          description: "Relentless attacks from bottom",
          order: 2,
          lessons: [
            { title: "The Triangle-Armbar-Omoplata Cycle", duration: 900, order: 1 },
            { title: "Kimura Trap System from Guard", duration: 840, order: 2 },
            { title: "Hip Bump to Guillotine to Triangle", duration: 780, order: 3 },
            { title: "Overhook Attack Sequences", duration: 720, order: 4 },
          ],
        },
        {
          title: "Top Position Chains",
          description: "Never let them escape your attacks",
          order: 3,
          lessons: [
            { title: "Mount: Arm Attacks to Chokes", duration: 840, order: 1 },
            { title: "Side Control: Americana to Kimura to Armbar", duration: 900, order: 2 },
            { title: "Knee on Belly Attack Flows", duration: 720, order: 3 },
            { title: "North-South Choke System", duration: 780, order: 4 },
          ],
        },
      ],
    },
  ],

  // ===================
  // ADVANCED LEVEL
  // ===================
  advancedCourses: [
    {
      title: "Back Attack System",
      slug: "back-attack-system",
      description: `The back is the highest percentage position in grappling. This course teaches you a complete system for taking, maintaining, and finishing from the back.

You'll master:
- Multiple back take entries
- Body triangle and seatbelt control
- RNC variations and troubleshooting
- Bow & arrow chokes
- Armbar from back
- Dealing with common escapes`,
      shortDescription: "Complete back attack system: entries, control, and high-percentage finishes.",
      discipline: "GRAPPLING",
      language: "EN",
      modules: [
        {
          title: "Taking the Back",
          description: "Multiple entries from every position",
          order: 1,
          lessons: [
            { title: "Back Takes from Guard", duration: 840, order: 1 },
            { title: "Back Takes from Top", duration: 780, order: 2 },
            { title: "Turtle Attacks to Back", duration: 720, order: 3 },
            { title: "Standing Back Takes", duration: 660, order: 4 },
            { title: "Berimbolo to Back", duration: 900, order: 5 },
          ],
        },
        {
          title: "Back Control",
          description: "Keep the back once you have it",
          order: 2,
          lessons: [
            { title: "Seatbelt & Harness Control", duration: 720, order: 1 },
            { title: "Body Triangle Mastery", duration: 780, order: 2 },
            { title: "Hooks vs Body Triangle", duration: 660, order: 3 },
            { title: "Preventing Common Escapes", duration: 840, order: 4 },
          ],
        },
        {
          title: "Back Finishes",
          description: "End the fight from behind",
          order: 3,
          lessons: [
            { title: "RNC: Short Choke vs Mata Leon", duration: 900, order: 1 },
            { title: "Dealing with Chin Defense", duration: 780, order: 2 },
            { title: "Bow & Arrow Choke", duration: 720, order: 3 },
            { title: "Armbar from Back Control", duration: 780, order: 4 },
            { title: "Chaining Back Attacks", duration: 840, order: 5 },
          ],
        },
      ],
    },
    {
      title: "Competition Strategy & Tactics",
      slug: "competition-strategy-tactics",
      description: `Winning competitions requires more than just technique - you need strategy, game planning, and mental preparation.

This course covers everything you need to compete at your best:
- Point scoring systems (IBJJF, ADCC, sub-only)
- Match strategy and pacing
- Stalling and advantages
- Mental preparation
- Cutting weight safely
- Pre-competition routines`,
      shortDescription: "Win more matches with competition strategy, point tactics, and mental prep.",
      discipline: "GRAPPLING",
      language: "EN",
      modules: [
        {
          title: "Understanding Competition Rules",
          description: "Know the rules to use them",
          order: 1,
          lessons: [
            { title: "IBJJF Scoring System", duration: 720, order: 1 },
            { title: "ADCC Rules Deep Dive", duration: 780, order: 2 },
            { title: "Submission Only Strategy", duration: 660, order: 3 },
            { title: "Advantages & Penalties", duration: 600, order: 4 },
          ],
        },
        {
          title: "Match Strategy",
          description: "Plan your path to victory",
          order: 2,
          lessons: [
            { title: "Early Match Strategy", duration: 720, order: 1 },
            { title: "When You're Ahead on Points", duration: 660, order: 2 },
            { title: "Coming from Behind", duration: 720, order: 3 },
            { title: "Overtime & Golden Score", duration: 600, order: 4 },
          ],
        },
        {
          title: "Mental Game",
          description: "The often-ignored key to winning",
          order: 3,
          lessons: [
            { title: "Pre-Competition Preparation", duration: 780, order: 1 },
            { title: "Managing Competition Nerves", duration: 720, order: 2 },
            { title: "Between-Match Recovery", duration: 600, order: 3 },
            { title: "Building Competition Confidence", duration: 840, order: 4 },
          ],
        },
      ],
    },
    {
      title: "No-Gi Specific Techniques",
      slug: "no-gi-specific-techniques",
      description: `No-gi grappling requires different grips, controls, and strategies than gi BJJ.

This course covers techniques that work best without the gi, including:
- No-gi grips and controls
- Guillotine variations
- D'arce and anaconda chokes
- Heel hook defense
- No-gi guard passing
- Wrestling tie-ups`,
      shortDescription: "No-gi specific grips, chokes, and strategies for submission grappling.",
      discipline: "GRAPPLING",
      language: "EN",
      modules: [
        {
          title: "No-Gi Control",
          description: "Grips and controls without the gi",
          order: 1,
          lessons: [
            { title: "Wrist Control & 2-on-1", duration: 720, order: 1 },
            { title: "Underhooks & Overhooks", duration: 780, order: 2 },
            { title: "Collar Ties & Russian Ties", duration: 720, order: 3 },
            { title: "Body Lock Control", duration: 660, order: 4 },
          ],
        },
        {
          title: "No-Gi Chokes",
          description: "Front headlock and arm-in chokes",
          order: 2,
          lessons: [
            { title: "Guillotine Variations", duration: 900, order: 1 },
            { title: "D'arce Choke System", duration: 840, order: 2 },
            { title: "Anaconda Choke", duration: 780, order: 3 },
            { title: "Japanese Necktie", duration: 660, order: 4 },
            { title: "Peruvian Necktie", duration: 720, order: 5 },
          ],
        },
        {
          title: "No-Gi Guard",
          description: "Guards that work without grips",
          order: 3,
          lessons: [
            { title: "Butterfly Guard No-Gi", duration: 780, order: 1 },
            { title: "Single Leg X No-Gi", duration: 840, order: 2 },
            { title: "Half Guard No-Gi", duration: 720, order: 3 },
            { title: "Closed Guard Without Grips", duration: 660, order: 4 },
          ],
        },
      ],
    },
  ],

  // ===================
  // GERMAN COURSES
  // ===================
  germanCourses: [
    {
      title: "BJJ Grundlagen für Einsteiger",
      slug: "bjj-grundlagen-einsteiger",
      description: `Lerne die wichtigsten Grundlagen des Brazilian Jiu-Jitsu in diesem umfassenden Anfängerkurs.

Du wirst die sechs Hauptpositionen, grundlegende Submissions und essentielle Escapes lernen, die das Fundament deiner Grappling-Reise bilden.

Was du lernen wirst:
- Die 6 Grundpositionen im BJJ
- Basis-Submissions aus jeder Position
- Wichtige Escapes und defensive Haltungen
- Richtiges Atmen und Entspannung unter Druck`,
      shortDescription: "Meistere BJJ-Grundlagen: Positionen, Submissions und Escapes für Anfänger.",
      discipline: "GRAPPLING",
      language: "DE",
      modules: [
        {
          title: "Positionen verstehen",
          description: "Lerne die Hierarchie der Positionen",
          order: 1,
          lessons: [
            { title: "Die Positionshierarchie erklärt", duration: 720, order: 1 },
            { title: "Closed Guard - Dein sicherer Hafen", duration: 840, order: 2 },
            { title: "Mount - Die dominante Position", duration: 780, order: 3 },
            { title: "Side Control Grundlagen", duration: 810, order: 4 },
          ],
        },
        {
          title: "Wichtige Escapes",
          description: "Nie wieder hilflos gefangen sein",
          order: 2,
          lessons: [
            { title: "Bridge & Roll (Upa) Escape", duration: 660, order: 1 },
            { title: "Ellbogen-Knie Escape vom Mount", duration: 720, order: 2 },
            { title: "Side Control Escape zur Guard", duration: 780, order: 3 },
            { title: "Turtle Verteidigung", duration: 690, order: 4 },
          ],
        },
        {
          title: "Deine ersten Submissions",
          description: "Lerne effektive Submissions für jedes Level",
          order: 3,
          lessons: [
            { title: "Americana vom Mount", duration: 600, order: 1 },
            { title: "Cross Collar Choke vom Mount", duration: 720, order: 2 },
            { title: "Armbar aus der Closed Guard", duration: 840, order: 3 },
            { title: "Triangle Choke Einführung", duration: 900, order: 4 },
          ],
        },
      ],
    },
  ],
};

// Seeding function
export async function seedGrapplingCurriculum(coachId: string) {
  console.log("🥋 Seeding Grappling Curriculum...");

  const allCourses = [
    ...grapplingCurriculum.beginnerCourses,
    ...grapplingCurriculum.intermediateCourses,
    ...grapplingCurriculum.advancedCourses,
    ...grapplingCurriculum.germanCourses,
  ];

  for (const courseData of allCourses) {
    const existingCourse = await prisma.course.findUnique({
      where: { slug: courseData.slug },
    });

    if (existingCourse) {
      console.log(`  ⏭️  Skipping existing course: ${courseData.title}`);
      continue;
    }

    const course = await prisma.course.create({
      data: {
        title: courseData.title,
        slug: courseData.slug,
        description: courseData.description,
        shortDescription: courseData.shortDescription,
        discipline: courseData.discipline as "GRAPPLING",
        language: courseData.language as "EN" | "DE",
        status: "PUBLISHED",
        coachId,
        modules: {
          create: courseData.modules.map((module) => ({
            title: module.title,
            description: module.description,
            order: module.order,
            lessons: {
              create: module.lessons.map((lesson) => ({
                title: lesson.title,
                videoDuration: lesson.duration,
                order: lesson.order,
                isPublished: true,
                isFreePreview: lesson.order === 1 && module.order === 1,
              })),
            },
          })),
        },
      },
    });

    console.log(`  ✅ Created: ${course.title}`);
  }

  console.log("✨ Grappling curriculum seeded successfully!");
}

// Main execution
async function main() {
  // Get or create a coach user
  let coach = await prisma.user.findFirst({
    where: { role: "COACH" },
  });

  if (!coach) {
    console.log("No coach found, creating demo coach...");
    coach = await prisma.user.create({
      data: {
        clerkId: "coach_grappling_demo",
        email: "coach@rootsonlineacademy.com",
        firstName: "Marcus",
        lastName: "Ribeiro",
        role: "COACH",
        subscriptionStatus: "ACTIVE",
      },
    });
  }

  await seedGrapplingCurriculum(coach.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
