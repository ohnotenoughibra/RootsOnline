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
  // ===============================
  // GRAPPLING - Positions
  // ===============================
  { name: "Closed Guard", slug: "closed-guard", discipline: "GRAPPLING" as const, description: "Full guard with legs locked around opponent" },
  { name: "Open Guard", slug: "open-guard", discipline: "GRAPPLING" as const, description: "Guard positions without legs locked" },
  { name: "Half Guard", slug: "half-guard", discipline: "GRAPPLING" as const, description: "Guard with one leg trapped" },
  { name: "Butterfly Guard", slug: "butterfly-guard", discipline: "GRAPPLING" as const, description: "Guard with feet hooked inside opponent's thighs" },
  { name: "De La Riva", slug: "de-la-riva", discipline: "GRAPPLING" as const, description: "Open guard with hook behind opponent's leg" },
  { name: "Reverse De La Riva", slug: "reverse-de-la-riva", discipline: "GRAPPLING" as const, description: "Nearside DLR hook variation" },
  { name: "Spider Guard", slug: "spider-guard", discipline: "GRAPPLING" as const, description: "Guard using sleeve grips and feet on biceps" },
  { name: "Lasso Guard", slug: "lasso-guard", discipline: "GRAPPLING" as const, description: "Guard with leg wrapped around opponent's arm" },
  { name: "X-Guard", slug: "x-guard", discipline: "GRAPPLING" as const, description: "Guard with legs forming X under opponent" },
  { name: "Single Leg X", slug: "single-leg-x", discipline: "GRAPPLING" as const, description: "One-legged X-guard position" },
  { name: "50/50", slug: "fifty-fifty", discipline: "GRAPPLING" as const, description: "Symmetrical leg entanglement" },
  { name: "Mount", slug: "mount", discipline: "GRAPPLING" as const, description: "Top position sitting on opponent's torso" },
  { name: "Side Control", slug: "side-control", discipline: "GRAPPLING" as const, description: "Chest-to-chest control from the side" },
  { name: "Back Control", slug: "back-control", discipline: "GRAPPLING" as const, description: "Control from behind with hooks" },
  { name: "Knee on Belly", slug: "knee-on-belly", discipline: "GRAPPLING" as const, description: "Knee pressing into opponent's stomach" },
  { name: "North-South", slug: "north-south", discipline: "GRAPPLING" as const, description: "Head-to-head top position" },
  { name: "Turtle", slug: "turtle", discipline: "GRAPPLING" as const, description: "Defensive position on hands and knees" },

  // ===============================
  // GRAPPLING - Submissions (Chokes)
  // ===============================
  { name: "Rear Naked Choke", slug: "rear-naked-choke", discipline: "GRAPPLING" as const, description: "Blood choke from back control" },
  { name: "Triangle Choke", slug: "triangle-choke", discipline: "GRAPPLING" as const, description: "Choke using legs around head and arm" },
  { name: "Guillotine", slug: "guillotine", discipline: "GRAPPLING" as const, description: "Front headlock choke" },
  { name: "D'Arce Choke", slug: "darce-choke", discipline: "GRAPPLING" as const, description: "Arm-in choke from side" },
  { name: "Anaconda Choke", slug: "anaconda-choke", discipline: "GRAPPLING" as const, description: "Arm-in choke rolling opponent" },
  { name: "Arm Triangle", slug: "arm-triangle", discipline: "GRAPPLING" as const, description: "Choke using opponent's arm and your arm" },
  { name: "Cross Collar Choke", slug: "cross-collar-choke", discipline: "GRAPPLING" as const, description: "Gi choke with crossed hands on collar" },
  { name: "Bow and Arrow", slug: "bow-and-arrow", discipline: "GRAPPLING" as const, description: "Gi choke from back control" },
  { name: "Ezekiel Choke", slug: "ezekiel-choke", discipline: "GRAPPLING" as const, description: "Choke using sleeve or arm wrap" },
  { name: "North-South Choke", slug: "north-south-choke", discipline: "GRAPPLING" as const, description: "Choke from north-south position" },
  { name: "Loop Choke", slug: "loop-choke", discipline: "GRAPPLING" as const, description: "Gi choke with circling motion" },
  { name: "Baseball Bat Choke", slug: "baseball-bat-choke", discipline: "GRAPPLING" as const, description: "Gi choke with bat grip on collar" },

  // ===============================
  // GRAPPLING - Submissions (Joint Locks)
  // ===============================
  { name: "Armbar", slug: "armbar", discipline: "GRAPPLING" as const, description: "Hyperextending the elbow joint" },
  { name: "Kimura", slug: "kimura", discipline: "GRAPPLING" as const, description: "Double wristlock shoulder lock" },
  { name: "Americana", slug: "americana", discipline: "GRAPPLING" as const, description: "Reverse keylock shoulder lock" },
  { name: "Omoplata", slug: "omoplata", discipline: "GRAPPLING" as const, description: "Shoulder lock using legs" },
  { name: "Wrist Lock", slug: "wrist-lock", discipline: "GRAPPLING" as const, description: "Attacking the wrist joint" },

  // ===============================
  // GRAPPLING - Leg Locks
  // ===============================
  { name: "Heel Hook", slug: "heel-hook", discipline: "GRAPPLING" as const, description: "Attacking the knee via heel rotation" },
  { name: "Inside Heel Hook", slug: "inside-heel-hook", discipline: "GRAPPLING" as const, description: "Heel hook with inside rotation" },
  { name: "Outside Heel Hook", slug: "outside-heel-hook", discipline: "GRAPPLING" as const, description: "Heel hook with outside rotation" },
  { name: "Knee Bar", slug: "knee-bar", discipline: "GRAPPLING" as const, description: "Hyperextending the knee joint" },
  { name: "Toe Hold", slug: "toe-hold", discipline: "GRAPPLING" as const, description: "Attacking ankle via foot rotation" },
  { name: "Calf Slicer", slug: "calf-slicer", discipline: "GRAPPLING" as const, description: "Compression lock on the calf" },
  { name: "Ashi Garami", slug: "ashi-garami", discipline: "GRAPPLING" as const, description: "Leg entanglement positions" },
  { name: "Saddle", slug: "saddle", discipline: "GRAPPLING" as const, description: "Inside sankaku leg position" },
  { name: "Straight Ankle Lock", slug: "straight-ankle-lock", discipline: "GRAPPLING" as const, description: "Basic ankle lock attack" },

  // ===============================
  // GRAPPLING - Sweeps
  // ===============================
  { name: "Scissor Sweep", slug: "scissor-sweep", discipline: "GRAPPLING" as const, description: "Closed guard sweep using scissoring legs" },
  { name: "Hip Bump Sweep", slug: "hip-bump-sweep", discipline: "GRAPPLING" as const, description: "Sweep by bumping opponent with hips" },
  { name: "Flower Sweep", slug: "flower-sweep", discipline: "GRAPPLING" as const, description: "Pendulum sweep from guard" },
  { name: "Butterfly Sweep", slug: "butterfly-sweep", discipline: "GRAPPLING" as const, description: "Sweep using butterfly hooks" },
  { name: "Hook Sweep", slug: "hook-sweep", discipline: "GRAPPLING" as const, description: "Sweep using leg hooks" },
  { name: "Berimbolo", slug: "berimbolo", discipline: "GRAPPLING" as const, description: "Inverted roll to back take" },
  { name: "Tripod Sweep", slug: "tripod-sweep", discipline: "GRAPPLING" as const, description: "Open guard sweep attacking balance" },

  // ===============================
  // GRAPPLING - Guard Passing
  // ===============================
  { name: "Guard Pass", slug: "guard-pass", discipline: "GRAPPLING" as const, description: "Techniques to pass the guard" },
  { name: "Knee Cut Pass", slug: "knee-cut-pass", discipline: "GRAPPLING" as const, description: "Passing by cutting knee across" },
  { name: "Toreando Pass", slug: "toreando-pass", discipline: "GRAPPLING" as const, description: "Bullfighter style pass" },
  { name: "Leg Drag", slug: "leg-drag", discipline: "GRAPPLING" as const, description: "Passing by dragging legs to side" },
  { name: "Stack Pass", slug: "stack-pass", discipline: "GRAPPLING" as const, description: "Pressure pass folding opponent" },
  { name: "Over Under Pass", slug: "over-under-pass", discipline: "GRAPPLING" as const, description: "One arm over, one arm under pass" },
  { name: "Long Step Pass", slug: "long-step-pass", discipline: "GRAPPLING" as const, description: "Passing by stepping wide" },
  { name: "Smash Pass", slug: "smash-pass", discipline: "GRAPPLING" as const, description: "Heavy pressure passing" },

  // ===============================
  // GRAPPLING - Takedowns & Wrestling
  // ===============================
  { name: "Takedown", slug: "takedown", discipline: "GRAPPLING" as const, description: "Taking opponent to the ground" },
  { name: "Double Leg", slug: "double-leg", discipline: "GRAPPLING" as const, description: "Takedown attacking both legs" },
  { name: "Single Leg", slug: "single-leg", discipline: "GRAPPLING" as const, description: "Takedown attacking one leg" },
  { name: "Body Lock", slug: "body-lock", discipline: "GRAPPLING" as const, description: "Takedown with arms around torso" },
  { name: "Snap Down", slug: "snap-down", discipline: "GRAPPLING" as const, description: "Pulling opponent down to turtle" },
  { name: "Arm Drag", slug: "arm-drag", discipline: "GRAPPLING" as const, description: "Pulling arm to take angle/back" },
  { name: "Ankle Pick", slug: "ankle-pick", discipline: "GRAPPLING" as const, description: "Low single leg to ankle" },
  { name: "Sprawl", slug: "sprawl", discipline: "GRAPPLING" as const, description: "Defending takedowns by sprawling" },

  // ===============================
  // GRAPPLING - Escapes & Defense
  // ===============================
  { name: "Mount Escape", slug: "mount-escape", discipline: "GRAPPLING" as const, description: "Escaping from bottom mount" },
  { name: "Side Control Escape", slug: "side-control-escape", discipline: "GRAPPLING" as const, description: "Escaping from side control" },
  { name: "Back Escape", slug: "back-escape", discipline: "GRAPPLING" as const, description: "Escaping back control" },
  { name: "Guard Retention", slug: "guard-retention", discipline: "GRAPPLING" as const, description: "Keeping guard against passes" },
  { name: "Bridge and Roll", slug: "bridge-and-roll", discipline: "GRAPPLING" as const, description: "Upa escape from mount" },
  { name: "Elbow-Knee Escape", slug: "elbow-knee-escape", discipline: "GRAPPLING" as const, description: "Shrimp escape to guard" },
  { name: "Submission Defense", slug: "submission-defense", discipline: "GRAPPLING" as const, description: "Defending against submissions" },

  // ===============================
  // GRAPPLING - Back Takes
  // ===============================
  { name: "Back Take", slug: "back-take", discipline: "GRAPPLING" as const, description: "Taking the back position" },
  { name: "Chair Sit", slug: "chair-sit", discipline: "GRAPPLING" as const, description: "Back take from turtle attack" },
  { name: "Kiss of the Dragon", slug: "kiss-of-the-dragon", discipline: "GRAPPLING" as const, description: "Inversion to back from RDLR" },
  { name: "Truck Position", slug: "truck-position", discipline: "GRAPPLING" as const, description: "Twister side back control" },

  // ===============================
  // MMA - Striking
  // ===============================
  { name: "Jab", slug: "jab", discipline: "MMA" as const, description: "Lead hand straight punch" },
  { name: "Cross", slug: "cross", discipline: "MMA" as const, description: "Rear hand straight punch" },
  { name: "Hook", slug: "hook", discipline: "MMA" as const, description: "Arcing punch to the side" },
  { name: "Uppercut", slug: "uppercut", discipline: "MMA" as const, description: "Upward punch to chin/body" },
  { name: "Overhand", slug: "overhand", discipline: "MMA" as const, description: "Looping punch over guard" },
  { name: "Body Shot", slug: "body-shot", discipline: "MMA" as const, description: "Punches to the body" },
  { name: "Low Kick", slug: "low-kick", discipline: "MMA" as const, description: "Kick to the leg" },
  { name: "Head Kick", slug: "head-kick", discipline: "MMA" as const, description: "High kick to the head" },
  { name: "Body Kick", slug: "body-kick", discipline: "MMA" as const, description: "Kick to the ribs/body" },
  { name: "Elbow Strike", slug: "elbow-strike", discipline: "MMA" as const, description: "Close range elbow attack" },
  { name: "Knee Strike", slug: "knee-strike", discipline: "MMA" as const, description: "Knee attack in clinch" },

  // ===============================
  // MMA - Cage Work
  // ===============================
  { name: "Clinch", slug: "clinch", discipline: "MMA" as const, description: "Close range tie-up fighting" },
  { name: "Dirty Boxing", slug: "dirty-boxing", discipline: "MMA" as const, description: "Punching in the clinch" },
  { name: "Cage Control", slug: "cage-control", discipline: "MMA" as const, description: "Using the cage for control" },
  { name: "Wall Work", slug: "wall-work", discipline: "MMA" as const, description: "Fighting against the cage" },
  { name: "Ground and Pound", slug: "ground-and-pound", discipline: "MMA" as const, description: "Striking from top position" },

  // ===============================
  // MMA - Defense
  // ===============================
  { name: "Sprawl", slug: "sprawl-mma", discipline: "MMA" as const, description: "Defending takedowns" },
  { name: "Takedown Defense", slug: "takedown-defense", discipline: "MMA" as const, description: "Preventing takedowns" },
  { name: "Head Movement", slug: "head-movement", discipline: "MMA" as const, description: "Slipping and rolling punches" },
  { name: "Blocking", slug: "blocking", discipline: "MMA" as const, description: "Blocking strikes" },
  { name: "Parrying", slug: "parrying", discipline: "MMA" as const, description: "Redirecting punches" },
  { name: "Check", slug: "check", discipline: "MMA" as const, description: "Blocking kicks with shin" },

  // ===============================
  // KICKBOXING - Punches
  // ===============================
  { name: "Jab (Kickboxing)", slug: "jab-kb", discipline: "KICKBOXING" as const, description: "Lead hand straight punch" },
  { name: "Cross (Kickboxing)", slug: "cross-kb", discipline: "KICKBOXING" as const, description: "Rear hand power punch" },
  { name: "Lead Hook", slug: "lead-hook", discipline: "KICKBOXING" as const, description: "Lead hand hook" },
  { name: "Rear Hook", slug: "rear-hook", discipline: "KICKBOXING" as const, description: "Rear hand hook" },
  { name: "Body Hook", slug: "body-hook", discipline: "KICKBOXING" as const, description: "Hook to the body" },
  { name: "Combination", slug: "combination", discipline: "KICKBOXING" as const, description: "Multiple strike sequences" },

  // ===============================
  // KICKBOXING - Kicks
  // ===============================
  { name: "Teep", slug: "teep", discipline: "KICKBOXING" as const, description: "Push kick/front kick" },
  { name: "Roundhouse Kick", slug: "roundhouse-kick", discipline: "KICKBOXING" as const, description: "Circular kick with shin" },
  { name: "Switch Kick", slug: "switch-kick", discipline: "KICKBOXING" as const, description: "Kick with stance switch" },
  { name: "Question Mark Kick", slug: "question-mark-kick", discipline: "KICKBOXING" as const, description: "Kick faking low going high" },
  { name: "Spinning Back Kick", slug: "spinning-back-kick", discipline: "KICKBOXING" as const, description: "Turning kick with heel" },
  { name: "Spinning Hook Kick", slug: "spinning-hook-kick", discipline: "KICKBOXING" as const, description: "Turning heel kick" },
  { name: "Axe Kick", slug: "axe-kick", discipline: "KICKBOXING" as const, description: "Downward heel strike" },
  { name: "Calf Kick", slug: "calf-kick", discipline: "KICKBOXING" as const, description: "Low kick to calf muscle" },

  // ===============================
  // KICKBOXING - Knees & Clinch
  // ===============================
  { name: "Straight Knee", slug: "straight-knee", discipline: "KICKBOXING" as const, description: "Direct knee strike" },
  { name: "Curve Knee", slug: "curve-knee", discipline: "KICKBOXING" as const, description: "Diagonal knee to body" },
  { name: "Flying Knee", slug: "flying-knee", discipline: "KICKBOXING" as const, description: "Jumping knee strike" },
  { name: "Clinch (Kickboxing)", slug: "clinch-kb", discipline: "KICKBOXING" as const, description: "Thai clinch/plum position" },
  { name: "Elbow", slug: "elbow", discipline: "KICKBOXING" as const, description: "Close range elbow strike" },
  { name: "Sweep (Kickboxing)", slug: "sweep-kb", discipline: "KICKBOXING" as const, description: "Off-balancing opponent" },

  // ===============================
  // KICKBOXING - Defense & Movement
  // ===============================
  { name: "Footwork", slug: "footwork", discipline: "KICKBOXING" as const, description: "Movement and angles" },
  { name: "Defense", slug: "defense", discipline: "KICKBOXING" as const, description: "Defensive techniques" },
  { name: "Slip", slug: "slip", discipline: "KICKBOXING" as const, description: "Moving head off line" },
  { name: "Bob and Weave", slug: "bob-and-weave", discipline: "KICKBOXING" as const, description: "Ducking under punches" },
  { name: "Counter", slug: "counter", discipline: "KICKBOXING" as const, description: "Counter-striking" },
  { name: "Catch and Return", slug: "catch-and-return", discipline: "KICKBOXING" as const, description: "Catching kick and countering" },
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
