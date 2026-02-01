import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Modern martial arts course content based on current meta
const courses = [
  // ============ GRAPPLING COURSES ============
  {
    title: "Modern Leg Lock System",
    slug: "modern-leg-lock-system",
    description: `Master the leg lock game that's dominating modern grappling. This comprehensive system covers everything from entries to finishes, with a focus on the positions and techniques used by elite competitors.

Learn the saddle/inside sankaku position, outside ashi, 50/50, and how to chain between them. Understand the hierarchy of leg entanglements and when to attack versus when to advance position.

This course includes competition-proven setups from guard, passing situations, and scrambles. You'll develop a complete offensive and defensive understanding of the lower body submission game.`,
    shortDescription: "Complete leg lock system from entries to finishes - saddle, ashi garami, heel hooks & more",
    discipline: "GRAPPLING" as const,
    language: "EN" as const,
    modules: [
      {
        title: "Foundations & Positioning",
        lessons: [
          { title: "Understanding Leg Entanglements", duration: 720 },
          { title: "The Inside Position (Saddle/Honey Hole)", duration: 840 },
          { title: "Outside Ashi Garami Mechanics", duration: 660 },
          { title: "50/50 Position Control", duration: 780 },
          { title: "Cross Ashi & Variations", duration: 600 },
        ],
      },
      {
        title: "Entries from Guard",
        lessons: [
          { title: "Single Leg X to Ashi", duration: 720 },
          { title: "K-Guard Entries", duration: 840 },
          { title: "Reverse De La Riva to Saddle", duration: 780 },
          { title: "Butterfly Guard Leg Entries", duration: 660 },
          { title: "Z-Guard to Inside Position", duration: 720 },
        ],
      },
      {
        title: "Finishing Mechanics",
        lessons: [
          { title: "Inside Heel Hook Finish", duration: 900 },
          { title: "Outside Heel Hook Details", duration: 840 },
          { title: "Toe Hold Mechanics", duration: 600 },
          { title: "Knee Bar from Various Positions", duration: 780 },
          { title: "Calf Slicer Attacks", duration: 540 },
        ],
      },
      {
        title: "Defense & Escapes",
        lessons: [
          { title: "Boot Defense Fundamentals", duration: 720 },
          { title: "Escaping the Saddle", duration: 840 },
          { title: "50/50 Defense & Counters", duration: 780 },
          { title: "When to Tap - Injury Prevention", duration: 480 },
        ],
      },
    ],
  },
  {
    title: "Wrestling for BJJ",
    slug: "wrestling-for-bjj",
    description: `Develop the wrestling skills essential for modern grappling competition. This course focuses on takedowns, chain wrestling, and top control specifically adapted for BJJ and submission grappling rules.

Learn high-percentage takedowns like the double leg, single leg, and snap down series. Master the art of hand fighting, level changes, and creating angles. Understand how to wrestle without the gi and adapt to submission threats.

Whether you're competing in ADCC, IBJJF No-Gi, or just want to improve your standup game, this course provides practical wrestling that works for grapplers.`,
    shortDescription: "Essential wrestling adapted for submission grappling - takedowns, chain wrestling & control",
    discipline: "GRAPPLING" as const,
    language: "EN" as const,
    modules: [
      {
        title: "Stance & Movement",
        lessons: [
          { title: "Wrestling Stance for Grapplers", duration: 600 },
          { title: "Level Changes & Penetration Steps", duration: 720 },
          { title: "Hand Fighting & Collar Ties", duration: 780 },
          { title: "Creating Angles", duration: 540 },
          { title: "Distance Management", duration: 660 },
        ],
      },
      {
        title: "Core Takedowns",
        lessons: [
          { title: "Double Leg Technique", duration: 900 },
          { title: "Single Leg Variations", duration: 840 },
          { title: "High Crotch Series", duration: 780 },
          { title: "Snap Down to Front Headlock", duration: 720 },
          { title: "Ankle Pick & Low Singles", duration: 660 },
        ],
      },
      {
        title: "Chain Wrestling",
        lessons: [
          { title: "Single to Double Transitions", duration: 720 },
          { title: "Failed Shot Recovery", duration: 660 },
          { title: "Go-Behinds & Back Takes", duration: 780 },
          { title: "Funk Rolls & Scrambles", duration: 840 },
        ],
      },
      {
        title: "Defensive Wrestling",
        lessons: [
          { title: "Sprawl Fundamentals", duration: 600 },
          { title: "Whizzer Defense", duration: 720 },
          { title: "Underhook Defense", duration: 660 },
          { title: "Countering to Submissions", duration: 780 },
        ],
      },
    ],
  },
  {
    title: "Guard Retention Masterclass",
    slug: "guard-retention-masterclass",
    description: `Stop getting your guard passed. This course teaches the systematic approach to guard retention used by the best defensive players in the world.

Learn the frames, hip movement, and recovery patterns that keep you safe. Understand the hierarchy of guards and how to transition between them under pressure. Develop the ability to reguard from seemingly impossible positions.

Covers retention against pressure passing, leg drags, knee cuts, and modern passing systems. You'll build an unpassable guard through drills and concepts.`,
    shortDescription: "Never get passed again - frames, hip movement & systematic guard recovery",
    discipline: "GRAPPLING" as const,
    language: "EN" as const,
    modules: [
      {
        title: "Retention Fundamentals",
        lessons: [
          { title: "The Guard Retention Hierarchy", duration: 720 },
          { title: "Essential Frames", duration: 660 },
          { title: "Hip Movement Patterns", duration: 780 },
          { title: "Elbow-Knee Connection", duration: 600 },
        ],
      },
      {
        title: "Retention vs Specific Passes",
        lessons: [
          { title: "Stopping the Knee Cut", duration: 840 },
          { title: "Leg Drag Defense", duration: 780 },
          { title: "Toreando Counter Movement", duration: 720 },
          { title: "Headquarters Defense", duration: 660 },
          { title: "Long Step Pass Prevention", duration: 720 },
        ],
      },
      {
        title: "Recovery Systems",
        lessons: [
          { title: "Granby Roll Escapes", duration: 660 },
          { title: "Turtle to Guard Recovery", duration: 720 },
          { title: "Half Guard Retention", duration: 780 },
          { title: "Reguarding from Side Control", duration: 840 },
        ],
      },
    ],
  },
  {
    title: "Systematisches Jiu-Jitsu für Anfänger",
    slug: "systematisches-jiu-jitsu-anfaenger",
    description: `Dein kompletter Einstieg ins Brazilian Jiu-Jitsu. Dieser Kurs führt dich systematisch durch alle Grundlagen - von der richtigen Haltung bis zu deinen ersten Submissions.

Lerne die wichtigsten Positionen, Escapes und Angriffe. Verstehe die Konzepte hinter den Techniken, damit du schneller Fortschritte machst. Entwickle ein solides Fundament für deine BJJ-Reise.

Perfekt für komplette Anfänger oder zur Auffrischung der Basics.`,
    shortDescription: "Kompletter BJJ-Grundlagenkurs auf Deutsch - Positionen, Escapes & erste Submissions",
    discipline: "GRAPPLING" as const,
    language: "DE" as const,
    modules: [
      {
        title: "Grundpositionen",
        lessons: [
          { title: "Die Guard Position verstehen", duration: 720 },
          { title: "Side Control Basics", duration: 660 },
          { title: "Mount Position", duration: 600 },
          { title: "Back Control", duration: 720 },
          { title: "Turtle & Headlock Positionen", duration: 540 },
        ],
      },
      {
        title: "Escapes & Verteidigung",
        lessons: [
          { title: "Mount Escape - Upa & Elbow-Knee", duration: 780 },
          { title: "Side Control Escapes", duration: 720 },
          { title: "Back Escape Grundlagen", duration: 660 },
          { title: "Verteidigung in der Turtle", duration: 600 },
        ],
      },
      {
        title: "Erste Submissions",
        lessons: [
          { title: "Cross Collar Choke", duration: 600 },
          { title: "Americana aus Side Control", duration: 540 },
          { title: "Armbar aus der Guard", duration: 720 },
          { title: "Triangle Choke Einführung", duration: 780 },
          { title: "Rear Naked Choke", duration: 600 },
        ],
      },
    ],
  },

  // ============ MMA COURSES ============
  {
    title: "MMA Striking Fundamentals",
    slug: "mma-striking-fundamentals",
    description: `Build a complete MMA striking game from the ground up. This course covers the boxing, kickboxing, and dirty boxing techniques essential for cage fighting.

Learn proper stance, footwork, and defense adapted for MMA where takedowns are a threat. Master the jab, cross, hooks, and kicks that set up your entire offensive game. Understand range management and how to fight at different distances.

Includes cage-specific techniques like wall work, cutting off the octagon, and fighting off the fence.`,
    shortDescription: "Complete MMA striking - boxing, kicks, elbows & cage-specific techniques",
    discipline: "MMA" as const,
    language: "EN" as const,
    modules: [
      {
        title: "Stance & Footwork",
        lessons: [
          { title: "MMA Fighting Stance", duration: 720 },
          { title: "Footwork Patterns", duration: 660 },
          { title: "Cutting Angles", duration: 600 },
          { title: "Cage Movement", duration: 780 },
          { title: "Range Management", duration: 720 },
        ],
      },
      {
        title: "Boxing for MMA",
        lessons: [
          { title: "The Jab - Your Most Important Weapon", duration: 840 },
          { title: "Cross & Power Punching", duration: 780 },
          { title: "Hooks to Head & Body", duration: 720 },
          { title: "Uppercuts & Overhands", duration: 660 },
          { title: "Boxing Combinations", duration: 900 },
        ],
      },
      {
        title: "Kicks & Knees",
        lessons: [
          { title: "Low Kick Technique", duration: 720 },
          { title: "Body Kicks", duration: 660 },
          { title: "Head Kicks & Setup", duration: 780 },
          { title: "Teep & Push Kicks", duration: 600 },
          { title: "Knees in the Clinch", duration: 720 },
        ],
      },
      {
        title: "Defense & Head Movement",
        lessons: [
          { title: "Slipping & Rolling", duration: 720 },
          { title: "Blocking & Parrying", duration: 660 },
          { title: "Check Hooks & Counters", duration: 780 },
          { title: "Defending Kicks", duration: 720 },
        ],
      },
    ],
  },
  {
    title: "Takedown Defense for Strikers",
    slug: "takedown-defense-strikers",
    description: `Keep the fight standing. This course teaches strikers how to defend takedowns and create opportunities to land strikes when wrestlers shoot.

Learn the sprawl, underhook defense, and whizzer techniques that keep you on your feet. Understand how to read takedown attempts and time your defense. Develop the skills to punish failed takedown attempts with strikes and knees.

Essential knowledge for any striker competing in MMA.`,
    shortDescription: "Stay on your feet - sprawls, underhooks & punishing failed shots",
    discipline: "MMA" as const,
    language: "EN" as const,
    modules: [
      {
        title: "Sprawl Fundamentals",
        lessons: [
          { title: "Reading the Shot", duration: 600 },
          { title: "Sprawl Technique", duration: 720 },
          { title: "Hip Position & Pressure", duration: 660 },
          { title: "Returning to Stance", duration: 540 },
        ],
      },
      {
        title: "Clinch Defense",
        lessons: [
          { title: "Underhook Fighting", duration: 780 },
          { title: "Whizzer & Overhook Control", duration: 720 },
          { title: "Head Position in Clinch", duration: 660 },
          { title: "Creating Separation", duration: 600 },
        ],
      },
      {
        title: "Cage Takedown Defense",
        lessons: [
          { title: "Wall Defense Positioning", duration: 720 },
          { title: "Hand Fighting on Cage", duration: 660 },
          { title: "Getting Off the Fence", duration: 780 },
          { title: "Turning the Position", duration: 720 },
        ],
      },
      {
        title: "Offensive Defense",
        lessons: [
          { title: "Knees to Shooting Opponents", duration: 660 },
          { title: "Uppercuts in the Clinch", duration: 720 },
          { title: "Elbows on the Break", duration: 600 },
          { title: "Front Headlock Attacks", duration: 780 },
        ],
      },
    ],
  },
  {
    title: "Ground & Pound Mastery",
    slug: "ground-and-pound-mastery",
    description: `Finish fights from top position. Learn the striking techniques, positioning, and strategy that make ground and pound effective in MMA.

Master the posture, base, and hip position that generate power on the ground. Understand how to maintain position while throwing strikes. Learn to create openings and finish with devastating ground strikes.

Covers ground and pound from mount, side control, half guard, and inside the guard.`,
    shortDescription: "Finish fights from top - positioning, power generation & ground striking",
    discipline: "MMA" as const,
    language: "EN" as const,
    modules: [
      {
        title: "Positioning for Ground Strikes",
        lessons: [
          { title: "Posture & Base in Guard", duration: 720 },
          { title: "Mount Striking Position", duration: 780 },
          { title: "Side Control GnP Setup", duration: 660 },
          { title: "Half Guard Top Striking", duration: 720 },
        ],
      },
      {
        title: "Strike Selection & Power",
        lessons: [
          { title: "Hammer Fists & Palm Strikes", duration: 600 },
          { title: "Punches from Top", duration: 720 },
          { title: "Elbows on the Ground", duration: 780 },
          { title: "Generating Power without Base Loss", duration: 660 },
        ],
      },
      {
        title: "Control & Finish",
        lessons: [
          { title: "Controlling Hips While Striking", duration: 720 },
          { title: "Creating Submission Openings", duration: 660 },
          { title: "Referee Stoppage Strategies", duration: 540 },
          { title: "Cage Ground & Pound", duration: 780 },
        ],
      },
    ],
  },

  // ============ KICKBOXING COURSES ============
  {
    title: "Dutch Kickboxing System",
    slug: "dutch-kickboxing-system",
    description: `Train the aggressive, combination-heavy style that made Dutch fighters legendary. This course breaks down the Dutch approach to kickboxing - constant pressure, volume striking, and devastating low kicks.

Learn the punch-kick combinations that define Dutch style. Master the low kick as a primary weapon, not just a setup. Develop the conditioning mindset and aggressive forward pressure.

Study techniques from the Dutch greats and apply them to your own fighting style.`,
    shortDescription: "Aggressive Dutch style - combinations, low kicks & forward pressure",
    discipline: "KICKBOXING" as const,
    language: "EN" as const,
    modules: [
      {
        title: "Dutch Style Foundations",
        lessons: [
          { title: "The Dutch Stance", duration: 660 },
          { title: "Forward Pressure Philosophy", duration: 720 },
          { title: "Volume vs Power Balance", duration: 600 },
          { title: "Conditioning for Dutch Style", duration: 540 },
        ],
      },
      {
        title: "The Low Kick Game",
        lessons: [
          { title: "Low Kick Technique Deep Dive", duration: 840 },
          { title: "Setting Up Low Kicks", duration: 720 },
          { title: "Switch Kick & Lead Leg Attacks", duration: 780 },
          { title: "Low Kick Defense & Checks", duration: 660 },
          { title: "Destroying the Lead Leg", duration: 720 },
        ],
      },
      {
        title: "Dutch Combinations",
        lessons: [
          { title: "The Classic 1-2 Low Kick", duration: 600 },
          { title: "3-Piece Combinations", duration: 720 },
          { title: "Body-Head Combinations", duration: 660 },
          { title: "Hook Kick Combos", duration: 780 },
          { title: "Non-Stop Pressure Chains", duration: 840 },
        ],
      },
      {
        title: "Clinch & Knees",
        lessons: [
          { title: "Dutch Clinch Entry", duration: 660 },
          { title: "Knee Techniques", duration: 720 },
          { title: "Clinch Dirty Boxing", duration: 780 },
          { title: "Breaking the Clinch", duration: 600 },
        ],
      },
    ],
  },
  {
    title: "Muay Thai Clinch Domination",
    slug: "muay-thai-clinch-domination",
    description: `Master the clinch game that defines Muay Thai. Learn the grips, sweeps, knees, and elbows that make the clinch a devastating position.

Develop the neck fighting, arm positioning, and balance that control the clinch. Learn to attack with knees and elbows while maintaining position. Master the sweeps and dumps that score and demoralize opponents.

Essential skills for Muay Thai competition or anyone wanting to improve their close-range fighting.`,
    shortDescription: "Complete Muay Thai clinch - grips, knees, elbows, sweeps & control",
    discipline: "KICKBOXING" as const,
    language: "EN" as const,
    modules: [
      {
        title: "Clinch Control",
        lessons: [
          { title: "The Plum Position", duration: 720 },
          { title: "Collar Ties & Head Control", duration: 660 },
          { title: "Arm Position & Hand Fighting", duration: 780 },
          { title: "Balance & Base in Clinch", duration: 600 },
          { title: "Off-Balancing Opponents", duration: 720 },
        ],
      },
      {
        title: "Clinch Attacks",
        lessons: [
          { title: "Straight Knee", duration: 660 },
          { title: "Curve Knee", duration: 600 },
          { title: "Spear Knee", duration: 540 },
          { title: "Elbows from Clinch", duration: 720 },
          { title: "Clinch to Strikes Exit", duration: 660 },
        ],
      },
      {
        title: "Sweeps & Throws",
        lessons: [
          { title: "Inside Trip", duration: 720 },
          { title: "Outside Trip", duration: 660 },
          { title: "Dump Techniques", duration: 780 },
          { title: "Catching Kicks to Sweep", duration: 840 },
        ],
      },
      {
        title: "Clinch Defense",
        lessons: [
          { title: "Preventing the Plum", duration: 600 },
          { title: "Breaking Grips", duration: 660 },
          { title: "Escaping Dominant Clinch", duration: 720 },
          { title: "Countering in Clinch", duration: 780 },
        ],
      },
    ],
  },
  {
    title: "Kickboxen für Einsteiger",
    slug: "kickboxen-einsteiger",
    description: `Dein Start ins Kickboxen. Lerne alle Grundtechniken von Grund auf - Schläge, Tritte, Verteidigung und Kombinationen.

Dieser Kurs ist perfekt für komplette Anfänger. Wir bauen deine Technik systematisch auf, von der Grundstellung bis zu deinen ersten Kombinationen. Du lernst sicher und effektiv zu trainieren.

Entwickle Selbstvertrauen, Fitness und die Grundlagen für fortgeschrittenes Training.`,
    shortDescription: "Kickbox-Grundlagen auf Deutsch - Schläge, Tritte, Verteidigung & Kombinationen",
    discipline: "KICKBOXING" as const,
    language: "DE" as const,
    modules: [
      {
        title: "Grundstellung & Bewegung",
        lessons: [
          { title: "Die richtige Kampfstellung", duration: 600 },
          { title: "Beinarbeit Grundlagen", duration: 660 },
          { title: "Distanz verstehen", duration: 540 },
          { title: "Defensive Bewegung", duration: 600 },
        ],
      },
      {
        title: "Schlagtechniken",
        lessons: [
          { title: "Die Führhand (Jab)", duration: 720 },
          { title: "Die Gerade (Cross)", duration: 660 },
          { title: "Haken zum Kopf & Körper", duration: 780 },
          { title: "Aufwärtshaken", duration: 600 },
          { title: "Erste Schlagkombinationen", duration: 720 },
        ],
      },
      {
        title: "Tritttechniken",
        lessons: [
          { title: "Low Kick Technik", duration: 720 },
          { title: "Mittlerer Roundhouse Kick", duration: 660 },
          { title: "Front Kick (Teep)", duration: 600 },
          { title: "Kicks mit Schlägen verbinden", duration: 780 },
        ],
      },
      {
        title: "Verteidigung",
        lessons: [
          { title: "Blocken & Parieren", duration: 660 },
          { title: "Kopfbewegung Basics", duration: 720 },
          { title: "Kick-Checks", duration: 600 },
          { title: "Gegenangriffe", duration: 720 },
        ],
      },
    ],
  },
];

// Real coaches
const realCoaches = {
  grappling: { firstName: "Chris", lastName: "Stäringer", email: "chris.staringer@rootsonlineacademy.com" },
  mma: { firstName: "Lukas", lastName: "Fromm", email: "lukas.fromm@rootsonlineacademy.com" },
  striking: { firstName: "Sebastian", lastName: "Witschela", email: "sebastian.witschela@rootsonlineacademy.com" },
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
        role: "COACH",
        subscriptionStatus: "ACTIVE",
      },
    });
    console.log(`Created coach: ${coachData.firstName} ${coachData.lastName}`);
  }

  return coach;
}

async function main() {
  console.log("Creating coaches if not exists...");

  // Create real coaches
  const grapplingCoach = await getOrCreateCoach(realCoaches.grappling);
  const mmaCoach = await getOrCreateCoach(realCoaches.mma);
  const strikingCoach = await getOrCreateCoach(realCoaches.striking);

  // Use grappling coach as default for these courses (mostly grappling-focused)
  const coach = grapplingCoach;

  console.log("Seeding courses...");

  for (const courseData of courses) {
    const { modules, ...courseInfo } = courseData;

    // Check if course exists
    const existing = await prisma.course.findUnique({
      where: { slug: courseInfo.slug },
    });

    if (existing) {
      console.log(`Course "${courseInfo.title}" already exists, skipping...`);
      continue;
    }

    // Create course
    const course = await prisma.course.create({
      data: {
        ...courseInfo,
        coachId: coach.id,
        status: "PUBLISHED",
        publishedAt: new Date(),
        featured: courseInfo.slug === "modern-leg-lock-system" || courseInfo.slug === "mma-striking-fundamentals",
      },
    });

    console.log(`Created course: ${course.title}`);

    // Create modules and lessons
    for (let moduleIndex = 0; moduleIndex < modules.length; moduleIndex++) {
      const moduleData = modules[moduleIndex];

      const module = await prisma.module.create({
        data: {
          title: moduleData.title,
          order: moduleIndex,
          courseId: course.id,
        },
      });

      for (let lessonIndex = 0; lessonIndex < moduleData.lessons.length; lessonIndex++) {
        const lessonData = moduleData.lessons[lessonIndex];

        await prisma.lesson.create({
          data: {
            title: lessonData.title,
            order: lessonIndex,
            moduleId: module.id,
            videoDuration: lessonData.duration,
            isPublished: true,
            isFreePreview: lessonIndex === 0 && moduleIndex === 0, // First lesson of first module is free
          },
        });
      }
    }

    console.log(`  - Created ${modules.length} modules with lessons`);
  }

  console.log("\nDone! Created courses:");
  const allCourses = await prisma.course.findMany({
    select: { title: true, slug: true, discipline: true, language: true },
  });
  allCourses.forEach((c) => {
    console.log(`  - [${c.discipline}] [${c.language}] ${c.title}`);
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
