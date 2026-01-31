import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const achievements = [
  // Streak achievements
  {
    name: "First Steps",
    slug: "first-steps",
    description: "Complete your first lesson",
    icon: "👶",
    category: "PROGRESS",
    requirement: 1,
    points: 10,
  },
  {
    name: "Getting Started",
    slug: "getting-started",
    description: "Complete 5 lessons",
    icon: "🚀",
    category: "PROGRESS",
    requirement: 5,
    points: 25,
  },
  {
    name: "Dedicated Learner",
    slug: "dedicated-learner",
    description: "Complete 25 lessons",
    icon: "📚",
    category: "PROGRESS",
    requirement: 25,
    points: 50,
  },
  {
    name: "Knowledge Seeker",
    slug: "knowledge-seeker",
    description: "Complete 50 lessons",
    icon: "🎓",
    category: "PROGRESS",
    requirement: 50,
    points: 100,
  },
  {
    name: "Master Student",
    slug: "master-student",
    description: "Complete 100 lessons",
    icon: "🏆",
    category: "PROGRESS",
    requirement: 100,
    points: 200,
  },

  // Streak achievements
  {
    name: "On Fire",
    slug: "on-fire",
    description: "Achieve a 3-day training streak",
    icon: "🔥",
    category: "STREAK",
    requirement: 3,
    points: 15,
  },
  {
    name: "Week Warrior",
    slug: "week-warrior",
    description: "Achieve a 7-day training streak",
    icon: "⚔️",
    category: "STREAK",
    requirement: 7,
    points: 35,
  },
  {
    name: "Consistent Fighter",
    slug: "consistent-fighter",
    description: "Achieve a 14-day training streak",
    icon: "🥊",
    category: "STREAK",
    requirement: 14,
    points: 70,
  },
  {
    name: "Iron Discipline",
    slug: "iron-discipline",
    description: "Achieve a 30-day training streak",
    icon: "💪",
    category: "STREAK",
    requirement: 30,
    points: 150,
  },
  {
    name: "Unstoppable",
    slug: "unstoppable",
    description: "Achieve a 100-day training streak",
    icon: "🦾",
    category: "STREAK",
    requirement: 100,
    points: 500,
  },

  // Certificate achievements
  {
    name: "Course Graduate",
    slug: "course-graduate",
    description: "Complete your first course",
    icon: "🎖️",
    category: "CERTIFICATE",
    requirement: 1,
    points: 100,
  },
  {
    name: "Triple Threat",
    slug: "triple-threat",
    description: "Complete 3 courses",
    icon: "🥇",
    category: "CERTIFICATE",
    requirement: 3,
    points: 250,
  },
  {
    name: "Course Collector",
    slug: "course-collector",
    description: "Complete 5 courses",
    icon: "🏅",
    category: "CERTIFICATE",
    requirement: 5,
    points: 400,
  },

  // Special achievements
  {
    name: "Early Bird",
    slug: "early-bird",
    description: "Complete a lesson before 7 AM",
    icon: "🌅",
    category: "SPECIAL",
    requirement: 1,
    points: 20,
  },
  {
    name: "Night Owl",
    slug: "night-owl",
    description: "Complete a lesson after 11 PM",
    icon: "🦉",
    category: "SPECIAL",
    requirement: 1,
    points: 20,
  },
  {
    name: "Weekend Warrior",
    slug: "weekend-warrior",
    description: "Train on both Saturday and Sunday",
    icon: "📅",
    category: "SPECIAL",
    requirement: 1,
    points: 30,
  },
];

const techniqueTags = [
  // Grappling techniques
  { name: "Armbar", slug: "armbar", discipline: "GRAPPLING" as const },
  { name: "Triangle Choke", slug: "triangle-choke", discipline: "GRAPPLING" as const },
  { name: "Rear Naked Choke", slug: "rear-naked-choke", discipline: "GRAPPLING" as const },
  { name: "Guillotine", slug: "guillotine", discipline: "GRAPPLING" as const },
  { name: "Kimura", slug: "kimura", discipline: "GRAPPLING" as const },
  { name: "Americana", slug: "americana", discipline: "GRAPPLING" as const },
  { name: "Omoplata", slug: "omoplata", discipline: "GRAPPLING" as const },
  { name: "Sweep", slug: "sweep", discipline: "GRAPPLING" as const },
  { name: "Guard Pass", slug: "guard-pass", discipline: "GRAPPLING" as const },
  { name: "Takedown", slug: "takedown", discipline: "GRAPPLING" as const },
  { name: "Mount Escape", slug: "mount-escape", discipline: "GRAPPLING" as const },
  { name: "Back Take", slug: "back-take", discipline: "GRAPPLING" as const },

  // MMA techniques
  { name: "Jab", slug: "jab", discipline: "MMA" as const },
  { name: "Cross", slug: "cross", discipline: "MMA" as const },
  { name: "Hook", slug: "hook", discipline: "MMA" as const },
  { name: "Uppercut", slug: "uppercut", discipline: "MMA" as const },
  { name: "Low Kick", slug: "low-kick", discipline: "MMA" as const },
  { name: "Head Kick", slug: "head-kick", discipline: "MMA" as const },
  { name: "Body Kick", slug: "body-kick", discipline: "MMA" as const },
  { name: "Clinch", slug: "clinch", discipline: "MMA" as const },
  { name: "Ground and Pound", slug: "ground-and-pound", discipline: "MMA" as const },
  { name: "Sprawl", slug: "sprawl", discipline: "MMA" as const },

  // Kickboxing techniques
  { name: "Teep", slug: "teep", discipline: "KICKBOXING" as const },
  { name: "Roundhouse Kick", slug: "roundhouse-kick", discipline: "KICKBOXING" as const },
  { name: "Switch Kick", slug: "switch-kick", discipline: "KICKBOXING" as const },
  { name: "Spinning Back Kick", slug: "spinning-back-kick", discipline: "KICKBOXING" as const },
  { name: "Knee Strike", slug: "knee-strike", discipline: "KICKBOXING" as const },
  { name: "Elbow", slug: "elbow", discipline: "KICKBOXING" as const },
  { name: "Combination", slug: "combination", discipline: "KICKBOXING" as const },
  { name: "Footwork", slug: "footwork", discipline: "KICKBOXING" as const },
  { name: "Defense", slug: "defense", discipline: "KICKBOXING" as const },
];

async function main() {
  console.log("Seeding achievements...");

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { slug: achievement.slug },
      update: achievement,
      create: achievement,
    });
  }

  console.log(`Created ${achievements.length} achievements`);

  console.log("Seeding technique tags...");

  for (const tag of techniqueTags) {
    await prisma.techniqueTag.upsert({
      where: { slug: tag.slug },
      update: tag,
      create: tag,
    });
  }

  console.log(`Created ${techniqueTags.length} technique tags`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
