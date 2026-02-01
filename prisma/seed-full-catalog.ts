import { PrismaClient, Discipline, Language, CourseStatus, Role } from "@prisma/client";

const prisma = new PrismaClient();

// Coaches
const coachEmails = {
  grappling: ["chris.staringer@rootsonlineacademy.com", "ibrahim.allaoui@rootsonlineacademy.com"],
  mma: ["lukas.fromm@rootsonlineacademy.com", "johnny.heigl@rootsonlineacademy.com"],
  kickboxing: ["sebastian.witschela@rootsonlineacademy.com", "johnny.heigl@rootsonlineacademy.com"],
};

// ===============================
// 30 GRAPPLING COURSES
// Based on modern BJJ/submission grappling meta
// ===============================
const grapplingCourses = [
  // BEGINNER (10 courses)
  {
    title: "BJJ White Belt Survival Guide",
    slug: "bjj-white-belt-survival-guide",
    description: "Everything you need to survive your first 6 months of BJJ. Learn the fundamental positions, basic escapes, and how to stay safe while rolling.",
    shortDescription: "Essential survival skills for brand new BJJ practitioners",
    featured: true,
    modules: [
      { title: "Understanding Positions", lessons: 5 },
      { title: "Basic Escapes", lessons: 6 },
      { title: "Staying Safe", lessons: 4 },
      { title: "Your First Attacks", lessons: 5 },
    ],
  },
  {
    title: "Closed Guard Fundamentals",
    slug: "closed-guard-fundamentals-complete",
    description: "Master the closed guard from the ground up. Learn grips, posture control, sweeps, and submissions that work at every level.",
    shortDescription: "Build a dangerous closed guard game from scratch",
    modules: [
      { title: "Guard Control Basics", lessons: 4 },
      { title: "Breaking Posture", lessons: 3 },
      { title: "Essential Sweeps", lessons: 5 },
      { title: "High-Percentage Submissions", lessons: 6 },
    ],
  },
  {
    title: "Escapes That Save You",
    slug: "escapes-that-save-you",
    description: "Comprehensive escape course covering mount, side control, back, and knee on belly. Never feel trapped again.",
    shortDescription: "Complete escape system from every bad position",
    modules: [
      { title: "Mount Escapes", lessons: 5 },
      { title: "Side Control Escapes", lessons: 5 },
      { title: "Back Escapes", lessons: 4 },
      { title: "Knee on Belly & North-South", lessons: 4 },
    ],
  },
  {
    title: "Side Control Domination",
    slug: "side-control-domination",
    description: "Learn to control and submit from side control. Heavy pressure, smooth transitions, and high-percentage finishes.",
    shortDescription: "Crushing side control for submissions and points",
    modules: [
      { title: "Pressure & Control", lessons: 4 },
      { title: "Transitions", lessons: 5 },
      { title: "Submission Attacks", lessons: 6 },
    ],
  },
  {
    title: "Mount Mastery",
    slug: "mount-mastery-complete",
    description: "The mount is the king of positions. Learn maintenance, transitions, and attacks from low mount, high mount, and S-mount.",
    shortDescription: "Complete mount control and attack system",
    modules: [
      { title: "Mount Maintenance", lessons: 4 },
      { title: "Mount Transitions", lessons: 4 },
      { title: "Choke Attacks", lessons: 5 },
      { title: "Arm Attacks", lessons: 5 },
    ],
  },
  {
    title: "Half Guard Basics",
    slug: "half-guard-basics",
    description: "Transform half guard from a recovery position to an offensive weapon. Learn the fundamentals of both top and bottom half guard.",
    shortDescription: "Half guard fundamentals for offense and defense",
    modules: [
      { title: "Bottom Half Fundamentals", lessons: 5 },
      { title: "Sweeps & Back Takes", lessons: 5 },
      { title: "Top Half Passing", lessons: 5 },
    ],
  },
  {
    title: "Basic Submissions Everyone Should Know",
    slug: "basic-submissions-everyone-should-know",
    description: "The 10 fundamental submissions that work from white belt to black belt. Proper mechanics and common mistakes.",
    shortDescription: "10 essential submissions with perfect mechanics",
    modules: [
      { title: "Arm Locks", lessons: 4 },
      { title: "Chokes from Guard", lessons: 4 },
      { title: "Chokes from Top", lessons: 4 },
      { title: "The Rear Naked Choke", lessons: 3 },
    ],
  },
  {
    title: "Takedowns for BJJ",
    slug: "takedowns-for-bjj-beginners",
    description: "Wrestling-based takedowns adapted for BJJ rules. Safe shots, clinch takedowns, and guard pulls done right.",
    shortDescription: "Wrestling takedowns adapted for gi and no-gi BJJ",
    modules: [
      { title: "Stance & Movement", lessons: 3 },
      { title: "Double & Single Leg", lessons: 5 },
      { title: "Clinch Takedowns", lessons: 4 },
      { title: "Guard Pulling", lessons: 3 },
    ],
  },
  {
    title: "Understanding BJJ Strategy",
    slug: "understanding-bjj-strategy",
    description: "Think before you roll. Learn the concepts and strategies that make technique effective. Position before submission.",
    shortDescription: "Strategic thinking for smarter rolling",
    modules: [
      { title: "Position Hierarchy", lessons: 3 },
      { title: "Energy Management", lessons: 3 },
      { title: "Reading Your Opponent", lessons: 4 },
      { title: "Building Your Game", lessons: 4 },
    ],
  },
  {
    title: "Gi Fundamentals & Grips",
    slug: "gi-fundamentals-grips",
    description: "Master gi-specific techniques. Grips, collar chokes, and using the gi to control and submit.",
    shortDescription: "Essential gi grips and gi-specific techniques",
    modules: [
      { title: "Grip Fighting", lessons: 4 },
      { title: "Collar Chokes", lessons: 5 },
      { title: "Sleeve & Pant Attacks", lessons: 4 },
      { title: "Lapel Techniques", lessons: 4 },
    ],
  },

  // INTERMEDIATE (10 courses)
  {
    title: "Guard Passing Blueprint",
    slug: "guard-passing-blueprint-v2",
    description: "A systematic approach to passing any guard. Pressure passes, speed passes, and when to use each.",
    shortDescription: "Complete guard passing system for intermediate players",
    featured: true,
    modules: [
      { title: "Passing Concepts", lessons: 4 },
      { title: "Pressure Passing", lessons: 6 },
      { title: "Speed Passing", lessons: 5 },
      { title: "Combination Passing", lessons: 5 },
    ],
  },
  {
    title: "De La Riva Guard Complete",
    slug: "de-la-riva-guard-complete",
    description: "Master the DLR guard used by world champions. Sweeps, back takes, berimbolo, and retention.",
    shortDescription: "Complete De La Riva system from basic to advanced",
    modules: [
      { title: "DLR Fundamentals", lessons: 5 },
      { title: "Basic Sweeps", lessons: 5 },
      { title: "Back Takes", lessons: 5 },
      { title: "Berimbolo System", lessons: 6 },
    ],
  },
  {
    title: "Half Guard Deep Dive",
    slug: "half-guard-deep-dive",
    description: "Advanced half guard including deep half, lockdown, and the knee shield system. Turn half guard into your A-game.",
    shortDescription: "Advanced half guard systems and sweeps",
    modules: [
      { title: "Knee Shield System", lessons: 5 },
      { title: "Deep Half Guard", lessons: 6 },
      { title: "Lockdown System", lessons: 5 },
      { title: "Half Guard Submissions", lessons: 4 },
    ],
  },
  {
    title: "Back Attack Encyclopedia",
    slug: "back-attack-encyclopedia",
    description: "Everything about the back position. Taking it, keeping it, and finishing from it. The highest percentage position in grappling.",
    shortDescription: "Complete back control and submission system",
    featured: true,
    modules: [
      { title: "Back Takes", lessons: 7 },
      { title: "Back Control", lessons: 5 },
      { title: "Finishing the RNC", lessons: 5 },
      { title: "Other Back Submissions", lessons: 5 },
    ],
  },
  {
    title: "Submission Chains & Combinations",
    slug: "submission-chains-combinations-v2",
    description: "Stop hunting single attacks. Chain submissions together so when one fails, another is waiting.",
    shortDescription: "Link submissions for relentless attacks",
    modules: [
      { title: "Guard Attack Chains", lessons: 5 },
      { title: "Mount Attack Chains", lessons: 5 },
      { title: "Back Attack Chains", lessons: 4 },
      { title: "Building Your Chains", lessons: 4 },
    ],
  },
  {
    title: "Butterfly Guard Mastery",
    slug: "butterfly-guard-mastery",
    description: "The butterfly guard is essential for no-gi and works great with the gi. Master sweeps, leg lock entries, and back takes.",
    shortDescription: "Butterfly guard sweeps and entries to leg locks",
    modules: [
      { title: "Butterfly Fundamentals", lessons: 4 },
      { title: "Classic Sweeps", lessons: 5 },
      { title: "SLX & X-Guard Entries", lessons: 5 },
      { title: "Butterfly to Back", lessons: 4 },
    ],
  },
  {
    title: "Guard Retention Masterclass",
    slug: "guard-retention-masterclass-v2",
    description: "Never get passed again. Learn the frames, hip movements, and recovery patterns of elite guard players.",
    shortDescription: "Systematic guard retention and recovery",
    modules: [
      { title: "Retention Concepts", lessons: 4 },
      { title: "Frames & Shields", lessons: 5 },
      { title: "Hip Movement", lessons: 5 },
      { title: "Recovery Systems", lessons: 5 },
    ],
  },
  {
    title: "Turtle Attacks & Defense",
    slug: "turtle-attacks-defense",
    description: "The turtle is everywhere in grappling. Learn to attack it and defend from it with modern techniques.",
    shortDescription: "Complete turtle position offense and defense",
    modules: [
      { title: "Turtle Defense", lessons: 4 },
      { title: "Escapes & Counters", lessons: 5 },
      { title: "Attacking Turtle", lessons: 6 },
      { title: "Front Headlock Series", lessons: 5 },
    ],
  },
  {
    title: "Spider & Lasso Guard System",
    slug: "spider-lasso-guard-system",
    description: "Master the distance management guards. Keep opponents away while setting up sweeps and submissions.",
    shortDescription: "Spider and lasso guard for gi players",
    modules: [
      { title: "Spider Guard Basics", lessons: 5 },
      { title: "Spider Sweeps & Triangles", lessons: 5 },
      { title: "Lasso Guard System", lessons: 5 },
      { title: "Combining Spider & Lasso", lessons: 4 },
    ],
  },
  {
    title: "Wrestling Integration for BJJ",
    slug: "wrestling-integration-bjj",
    description: "Add wrestling to your BJJ game. Hand fighting, shot selection, and chain wrestling concepts.",
    shortDescription: "Wrestling techniques adapted for BJJ competition",
    modules: [
      { title: "Wrestling Stance for BJJ", lessons: 4 },
      { title: "Shot Mechanics", lessons: 5 },
      { title: "Chain Wrestling", lessons: 5 },
      { title: "Defense & Counters", lessons: 5 },
    ],
  },

  // ADVANCED (10 courses)
  {
    title: "Modern Leg Lock System",
    slug: "modern-leg-lock-system-complete",
    description: "The complete leg lock game dominating modern grappling. Ashi garami, saddle, heel hooks, and the complete system.",
    shortDescription: "Complete leg lock system from entries to finishes",
    featured: true,
    modules: [
      { title: "Leg Entanglement Positions", lessons: 6 },
      { title: "Entries from Guard", lessons: 6 },
      { title: "Entries from Top", lessons: 5 },
      { title: "Finishing Mechanics", lessons: 6 },
      { title: "Defense & Escapes", lessons: 5 },
    ],
  },
  {
    title: "ADCC Preparation",
    slug: "adcc-preparation-complete",
    description: "Train for the world's most prestigious submission grappling tournament. ADCC rules, strategies, and techniques.",
    shortDescription: "Complete ADCC competition preparation",
    modules: [
      { title: "ADCC Rules Deep Dive", lessons: 4 },
      { title: "Negative Point Strategies", lessons: 5 },
      { title: "Overtime Strategy", lessons: 4 },
      { title: "High-Level Techniques", lessons: 6 },
    ],
  },
  {
    title: "Competition Game Planning",
    slug: "competition-game-planning",
    description: "Build and execute competition game plans. Study opponents, plan your strategy, and perform under pressure.",
    shortDescription: "Strategic game planning for competition success",
    modules: [
      { title: "Building Your A-Game", lessons: 4 },
      { title: "Studying Opponents", lessons: 4 },
      { title: "Match Strategy", lessons: 5 },
      { title: "Mental Preparation", lessons: 4 },
    ],
  },
  {
    title: "Reverse De La Riva System",
    slug: "reverse-de-la-riva-system",
    description: "The RDLR guard for kiss of the dragon, crab ride, and modern back takes. Essential for leg lock players.",
    shortDescription: "RDLR entries to back takes and leg locks",
    modules: [
      { title: "RDLR Fundamentals", lessons: 4 },
      { title: "Kiss of the Dragon", lessons: 5 },
      { title: "Crab Ride System", lessons: 5 },
      { title: "Leg Lock Entries", lessons: 5 },
    ],
  },
  {
    title: "Body Lock Passing",
    slug: "body-lock-passing-system",
    description: "The passing system of choice for elite no-gi competitors. Body lock passing shuts down guards.",
    shortDescription: "High-pressure body lock passing for no-gi",
    modules: [
      { title: "Body Lock Fundamentals", lessons: 4 },
      { title: "Closing Distance", lessons: 5 },
      { title: "Passing Sequences", lessons: 6 },
      { title: "Dealing with Counters", lessons: 4 },
    ],
  },
  {
    title: "K-Guard & Modern Guards",
    slug: "k-guard-modern-guards",
    description: "Learn the K-Guard system and other modern guard innovations. Entries to back, leg locks, and sweeps.",
    shortDescription: "K-Guard and modern guard innovations",
    modules: [
      { title: "K-Guard Mechanics", lessons: 5 },
      { title: "Entries & Setups", lessons: 5 },
      { title: "Attacks from K-Guard", lessons: 6 },
      { title: "Combining with Other Guards", lessons: 4 },
    ],
  },
  {
    title: "Front Headlock Mastery",
    slug: "front-headlock-mastery",
    description: "The front headlock position for guillotines, darces, anacondas, and go-behinds. A complete system.",
    shortDescription: "Complete front headlock submission system",
    modules: [
      { title: "Front Headlock Control", lessons: 4 },
      { title: "Guillotine Variations", lessons: 6 },
      { title: "D'Arce & Anaconda", lessons: 6 },
      { title: "Transitions & Go-Behinds", lessons: 5 },
    ],
  },
  {
    title: "Truck & Twister System",
    slug: "truck-twister-system",
    description: "The truck position for calf slicers, banana splits, and the famous twister. Unorthodox but effective.",
    shortDescription: "Truck position attacks including the twister",
    modules: [
      { title: "Entering the Truck", lessons: 5 },
      { title: "Truck Control", lessons: 4 },
      { title: "Calf Slicer & Banana Split", lessons: 5 },
      { title: "The Twister", lessons: 4 },
    ],
  },
  {
    title: "Standing Submissions",
    slug: "standing-submissions",
    description: "Guillotines, arm drags to back, and flying submissions. End fights before they hit the ground.",
    shortDescription: "Submissions from standing and clinch positions",
    modules: [
      { title: "Standing Guillotine", lessons: 5 },
      { title: "Standing Arm Attacks", lessons: 4 },
      { title: "Arm Drags to Back", lessons: 5 },
      { title: "Flying Submissions", lessons: 4 },
    ],
  },
  {
    title: "50/50 Complete System",
    slug: "fifty-fifty-complete-system",
    description: "The 50/50 position for leg locks and sweeps. Understand when to enter, attack, and escape.",
    shortDescription: "Complete 50/50 offense and defense",
    modules: [
      { title: "50/50 Mechanics", lessons: 4 },
      { title: "Entries to 50/50", lessons: 5 },
      { title: "Attacks from 50/50", lessons: 6 },
      { title: "Escaping 50/50", lessons: 4 },
    ],
  },
];

// ===============================
// 30 KICKBOXING COURSES
// Based on modern Muay Thai, Dutch, K-1
// ===============================
const kickboxingCourses = [
  // BEGINNER (10 courses)
  {
    title: "Kickboxing Fundamentals",
    slug: "kickboxing-fundamentals-complete",
    description: "Complete beginner course covering stance, footwork, punches, kicks, and basic defense. Start your striking journey here.",
    shortDescription: "Everything you need to start kickboxing",
    featured: true,
    modules: [
      { title: "Stance & Movement", lessons: 5 },
      { title: "Basic Punches", lessons: 6 },
      { title: "Fundamental Kicks", lessons: 6 },
      { title: "Basic Defense", lessons: 5 },
    ],
  },
  {
    title: "Boxing for Kickboxers",
    slug: "boxing-for-kickboxers",
    description: "Develop your hand game. Jabs, crosses, hooks, uppercuts, and combinations specific to kickboxing.",
    shortDescription: "Essential boxing skills for kickboxing",
    modules: [
      { title: "Jab Mastery", lessons: 4 },
      { title: "Power Punches", lessons: 5 },
      { title: "Hooks & Uppercuts", lessons: 5 },
      { title: "Boxing Combinations", lessons: 5 },
    ],
  },
  {
    title: "Kick Fundamentals",
    slug: "kick-fundamentals",
    description: "Master the fundamental kicks: teep, roundhouse to leg/body/head, and basic spinning kicks.",
    shortDescription: "Essential kicking technique and mechanics",
    modules: [
      { title: "The Teep", lessons: 4 },
      { title: "Roundhouse Mechanics", lessons: 5 },
      { title: "Low Kicks", lessons: 5 },
      { title: "Body & Head Kicks", lessons: 5 },
    ],
  },
  {
    title: "Defense Fundamentals",
    slug: "defense-fundamentals-kickboxing",
    description: "Don't just throw punches - learn to not get hit. Blocking, parrying, slipping, and checking kicks.",
    shortDescription: "Complete defensive skills for kickboxers",
    modules: [
      { title: "Punch Defense", lessons: 5 },
      { title: "Kick Defense", lessons: 5 },
      { title: "Head Movement", lessons: 5 },
      { title: "Distance Management", lessons: 4 },
    ],
  },
  {
    title: "Footwork & Movement",
    slug: "footwork-movement-kickboxing",
    description: "Movement is the foundation of good striking. Learn to cut angles, create distance, and control the ring.",
    shortDescription: "Ring control through superior footwork",
    modules: [
      { title: "Basic Movement", lessons: 4 },
      { title: "Cutting Angles", lessons: 5 },
      { title: "In-and-Out Movement", lessons: 4 },
      { title: "Ring Cutting", lessons: 5 },
    ],
  },
  {
    title: "Basic Combinations",
    slug: "basic-combinations-kickboxing",
    description: "Learn to put strikes together. Essential punch-kick combinations that flow naturally.",
    shortDescription: "Fundamental striking combinations",
    modules: [
      { title: "Punch Combinations", lessons: 5 },
      { title: "Kick Combinations", lessons: 5 },
      { title: "Punch-Kick Combos", lessons: 6 },
      { title: "Counter Combinations", lessons: 4 },
    ],
  },
  {
    title: "Southpaw vs Orthodox Basics",
    slug: "southpaw-orthodox-basics",
    description: "Understand the dynamics of fighting opposite stances. Essential knowledge for all kickboxers.",
    shortDescription: "Fighting opposite stances fundamentals",
    modules: [
      { title: "Understanding Stances", lessons: 3 },
      { title: "Orthodox vs Southpaw", lessons: 5 },
      { title: "Southpaw vs Orthodox", lessons: 5 },
      { title: "Switching Stances", lessons: 4 },
    ],
  },
  {
    title: "Sparring for Beginners",
    slug: "sparring-for-beginners-kickboxing",
    description: "Your first steps into sparring. Mindset, technical sparring, and building confidence.",
    shortDescription: "Safe introduction to kickboxing sparring",
    modules: [
      { title: "Sparring Mindset", lessons: 3 },
      { title: "Technical Sparring", lessons: 5 },
      { title: "Light Sparring", lessons: 5 },
      { title: "Building Confidence", lessons: 4 },
    ],
  },
  {
    title: "Pad Work Fundamentals",
    slug: "pad-work-fundamentals",
    description: "Get the most out of pad work. Proper technique, timing, and combinations for padholders and strikers.",
    shortDescription: "Effective pad work for skill development",
    modules: [
      { title: "Pad Holding Basics", lessons: 4 },
      { title: "Striking the Pads", lessons: 5 },
      { title: "Combination Drills", lessons: 5 },
      { title: "Timing & Rhythm", lessons: 4 },
    ],
  },
  {
    title: "Kickboxing Conditioning",
    slug: "kickboxing-conditioning",
    description: "Build the endurance and power needed for kickboxing. Sport-specific conditioning workouts.",
    shortDescription: "Conditioning for kickboxing performance",
    modules: [
      { title: "Cardio for Fighters", lessons: 4 },
      { title: "Power Development", lessons: 5 },
      { title: "Core Strength", lessons: 4 },
      { title: "Recovery & Flexibility", lessons: 4 },
    ],
  },

  // INTERMEDIATE (10 courses)
  {
    title: "Dutch Kickboxing System",
    slug: "dutch-kickboxing-system-complete",
    description: "The aggressive Dutch style: constant pressure, high volume, and devastating low kicks. Train like the Dutch legends.",
    shortDescription: "High-volume Dutch kickboxing system",
    featured: true,
    modules: [
      { title: "Dutch Philosophy", lessons: 4 },
      { title: "Pressure Fighting", lessons: 5 },
      { title: "Dutch Combinations", lessons: 7 },
      { title: "The Low Kick Game", lessons: 6 },
    ],
  },
  {
    title: "Muay Thai Clinch Complete",
    slug: "muay-thai-clinch-complete",
    description: "Master the Thai clinch. Neck fighting, knees, elbows, sweeps, and clinch control.",
    shortDescription: "Complete Muay Thai clinch fighting",
    featured: true,
    modules: [
      { title: "Clinch Control", lessons: 5 },
      { title: "Knee Attacks", lessons: 6 },
      { title: "Elbows from Clinch", lessons: 5 },
      { title: "Sweeps & Dumps", lessons: 6 },
    ],
  },
  {
    title: "Counter-Fighting System",
    slug: "counter-fighting-system",
    description: "Make your opponent pay for attacking. Timing, reading, and executing perfect counters.",
    shortDescription: "Counter-striking mastery for all styles",
    modules: [
      { title: "Counter Philosophy", lessons: 4 },
      { title: "Punch Counters", lessons: 6 },
      { title: "Kick Counters", lessons: 6 },
      { title: "Baiting & Trapping", lessons: 5 },
    ],
  },
  {
    title: "Advanced Kick Techniques",
    slug: "advanced-kick-techniques",
    description: "Beyond the basics: question mark kicks, switch kicks, spinning kicks, and advanced setups.",
    shortDescription: "Advanced kicking for experienced strikers",
    modules: [
      { title: "Question Mark Kick", lessons: 5 },
      { title: "Switch Kicks", lessons: 5 },
      { title: "Spinning Kicks", lessons: 6 },
      { title: "Advanced Setups", lessons: 5 },
    ],
  },
  {
    title: "Body Shot Mastery",
    slug: "body-shot-mastery",
    description: "Attack the body to break your opponent. Liver shots, body kicks, and body shot setups.",
    shortDescription: "Body attack system for fight-ending damage",
    modules: [
      { title: "Body Shot Anatomy", lessons: 4 },
      { title: "Body Punches", lessons: 5 },
      { title: "Body Kicks", lessons: 5 },
      { title: "Body Shot Setups", lessons: 5 },
    ],
  },
  {
    title: "Elbow & Knee Mastery",
    slug: "elbow-knee-mastery",
    description: "The close-range weapons of Muay Thai. Devastating elbows and knees that end fights.",
    shortDescription: "Complete elbow and knee attack system",
    modules: [
      { title: "Elbow Techniques", lessons: 6 },
      { title: "Elbow Entries", lessons: 5 },
      { title: "Knee Techniques", lessons: 6 },
      { title: "Combining Elbows & Knees", lessons: 5 },
    ],
  },
  {
    title: "Teep Mastery",
    slug: "teep-mastery-complete",
    description: "The most underrated weapon in kickboxing. Use the teep to control distance, set up attacks, and frustrate opponents.",
    shortDescription: "Complete teep (push kick) system",
    modules: [
      { title: "Teep Mechanics", lessons: 4 },
      { title: "Offensive Teeps", lessons: 5 },
      { title: "Defensive Teeps", lessons: 5 },
      { title: "Teep Combinations", lessons: 5 },
    ],
  },
  {
    title: "Head Movement for Kickboxing",
    slug: "head-movement-for-kickboxing",
    description: "Move your head, don't get hit. Slips, rolls, and pulls adapted for kickboxing where kicks are a threat.",
    shortDescription: "Boxing head movement adapted for kickboxing",
    modules: [
      { title: "Slipping Punches", lessons: 5 },
      { title: "Rolling Under", lessons: 4 },
      { title: "Pull Counters", lessons: 5 },
      { title: "Combining with Kicks", lessons: 5 },
    ],
  },
  {
    title: "Fight IQ & Ring Generalship",
    slug: "fight-iq-ring-generalship",
    description: "Think like a champion. Control the ring, read your opponent, and make smart decisions.",
    shortDescription: "Strategic thinking for the intelligent fighter",
    modules: [
      { title: "Ring Control", lessons: 5 },
      { title: "Reading Opponents", lessons: 5 },
      { title: "Adjusting Mid-Fight", lessons: 5 },
      { title: "Pace & Pressure", lessons: 4 },
    ],
  },
  {
    title: "Leg Kick Defense & Counters",
    slug: "leg-kick-defense-counters",
    description: "Don't let leg kicks destroy you. Check, catch, and counter leg kick attacks.",
    shortDescription: "Defend and counter leg kick attacks",
    modules: [
      { title: "Checking Kicks", lessons: 5 },
      { title: "Catching Kicks", lessons: 5 },
      { title: "Counter Attacks", lessons: 6 },
      { title: "Movement Defense", lessons: 4 },
    ],
  },

  // ADVANCED (10 courses)
  {
    title: "K-1 Style Kickboxing",
    slug: "k1-style-kickboxing",
    description: "The explosive K-1 style: big knockouts, highlight-reel kicks, and aggressive combinations.",
    shortDescription: "K-1 rules kickboxing for knockouts",
    featured: true,
    modules: [
      { title: "K-1 Style Overview", lessons: 4 },
      { title: "Knockout Combinations", lessons: 6 },
      { title: "Power Kicking", lessons: 6 },
      { title: "Tournament Strategy", lessons: 4 },
    ],
  },
  {
    title: "Muay Femur Style",
    slug: "muay-femur-style",
    description: "The technical Thai style of Saenchai and other legends. Footwork, timing, and beautiful technique.",
    shortDescription: "Technical Muay Thai in the Muay Femur style",
    modules: [
      { title: "Muay Femur Philosophy", lessons: 4 },
      { title: "Footwork & Evasion", lessons: 6 },
      { title: "Timing & Counters", lessons: 6 },
      { title: "Showmanship Techniques", lessons: 5 },
    ],
  },
  {
    title: "Pressure Fighting Mastery",
    slug: "pressure-fighting-mastery",
    description: "Walk down your opponents and break them. Cutting off the ring, body work, and relentless pressure.",
    shortDescription: "Aggressive pressure fighting system",
    modules: [
      { title: "Pressure Philosophy", lessons: 4 },
      { title: "Ring Cutting", lessons: 5 },
      { title: "Body Attack System", lessons: 6 },
      { title: "Breaking Opponents", lessons: 5 },
    ],
  },
  {
    title: "Competition Kickboxing",
    slug: "competition-kickboxing-advanced",
    description: "Everything you need to compete and win. Rules, strategy, peaking, and mental preparation.",
    shortDescription: "Complete competition preparation for kickboxers",
    modules: [
      { title: "Competition Rules", lessons: 4 },
      { title: "Game Planning", lessons: 5 },
      { title: "Peaking for Competition", lessons: 4 },
      { title: "Mental Game", lessons: 5 },
    ],
  },
  {
    title: "Tricky Strikes & Setups",
    slug: "tricky-strikes-setups",
    description: "Unorthodox techniques that catch opponents off guard. Feints, level changes, and creative attacks.",
    shortDescription: "Unorthodox attacks and deceptive setups",
    modules: [
      { title: "Feinting System", lessons: 5 },
      { title: "Level Changing", lessons: 5 },
      { title: "Unorthodox Attacks", lessons: 6 },
      { title: "Setting Traps", lessons: 5 },
    ],
  },
  {
    title: "In-Fighting & Dirty Boxing",
    slug: "in-fighting-dirty-boxing",
    description: "Dominate in close range. Dirty boxing, short punches, and in-fighting tactics.",
    shortDescription: "Close-range fighting and dirty boxing",
    modules: [
      { title: "In-Fighting Fundamentals", lessons: 4 },
      { title: "Dirty Boxing", lessons: 6 },
      { title: "Short Punches", lessons: 5 },
      { title: "Clinch to Strikes", lessons: 5 },
    ],
  },
  {
    title: "Southpaw Specialist",
    slug: "southpaw-specialist",
    description: "Fighting from the southpaw stance. Advantages, strategies, and techniques specific to southpaws.",
    shortDescription: "Complete southpaw fighting system",
    modules: [
      { title: "Southpaw Advantages", lessons: 4 },
      { title: "Southpaw Combinations", lessons: 6 },
      { title: "vs Orthodox Fighters", lessons: 6 },
      { title: "Switching Stances", lessons: 4 },
    ],
  },
  {
    title: "Breaking Down Defensive Fighters",
    slug: "breaking-down-defensive-fighters",
    description: "When opponents shell up or run, you need tools to break them down. Pressure, feints, and body work.",
    shortDescription: "Attacking defensive and evasive opponents",
    modules: [
      { title: "Reading Defensive Styles", lessons: 4 },
      { title: "Opening Up Defense", lessons: 5 },
      { title: "Body Attack Plan", lessons: 5 },
      { title: "Feinting & Pressure", lessons: 5 },
    ],
  },
  {
    title: "Creating Knockouts",
    slug: "creating-knockouts",
    description: "Set up fight-ending shots. Power development, timing, and knockout combinations.",
    shortDescription: "Setting up and landing knockout shots",
    modules: [
      { title: "Knockout Mechanics", lessons: 4 },
      { title: "Setting Up the Big Shot", lessons: 6 },
      { title: "Knockout Combinations", lessons: 6 },
      { title: "Reading Hurt Opponents", lessons: 4 },
    ],
  },
  {
    title: "Advanced Thai Sweeps & Trips",
    slug: "advanced-thai-sweeps-trips",
    description: "Score points and demoralize opponents with catches, sweeps, and trips from the Thai tradition.",
    shortDescription: "Muay Thai sweeps and trips for competition",
    modules: [
      { title: "Catching Kicks", lessons: 5 },
      { title: "Inside Trips", lessons: 5 },
      { title: "Outside Trips", lessons: 5 },
      { title: "Dump Techniques", lessons: 5 },
    ],
  },
];

// ===============================
// 30 MMA COURSES
// Based on modern UFC-style MMA
// ===============================
const mmaCourses = [
  // BEGINNER (10 courses)
  {
    title: "MMA Fundamentals Complete",
    slug: "mma-fundamentals-complete",
    description: "Everything you need to start training MMA. Striking, grappling, and how to combine them.",
    shortDescription: "Complete MMA fundamentals for beginners",
    featured: true,
    modules: [
      { title: "MMA Stance & Movement", lessons: 5 },
      { title: "Basic Striking for MMA", lessons: 6 },
      { title: "Takedown Fundamentals", lessons: 5 },
      { title: "Ground Basics", lessons: 5 },
    ],
  },
  {
    title: "MMA Striking Basics",
    slug: "mma-striking-basics",
    description: "Striking fundamentals adapted for MMA. Stance, punches, kicks, and basic defense with takedowns in mind.",
    shortDescription: "Striking adapted for MMA's unique threats",
    modules: [
      { title: "MMA Striking Stance", lessons: 4 },
      { title: "Basic Punches", lessons: 5 },
      { title: "Basic Kicks", lessons: 5 },
      { title: "Defense vs Strikes", lessons: 5 },
    ],
  },
  {
    title: "Wrestling for MMA Beginners",
    slug: "wrestling-for-mma-beginners",
    description: "Wrestling fundamentals for MMA. Takedowns, defense, and controlling the fight location.",
    shortDescription: "Essential wrestling skills for MMA",
    modules: [
      { title: "Wrestling Stance", lessons: 4 },
      { title: "Basic Takedowns", lessons: 6 },
      { title: "Sprawl & Defense", lessons: 5 },
      { title: "Clinch Wrestling", lessons: 4 },
    ],
  },
  {
    title: "Ground Fighting for MMA",
    slug: "ground-fighting-for-mma",
    description: "MMA-specific ground work. Positions, escapes, and basic submissions with ground and pound awareness.",
    shortDescription: "Ground fighting fundamentals for MMA",
    modules: [
      { title: "MMA Ground Positions", lessons: 5 },
      { title: "Basic Escapes", lessons: 5 },
      { title: "Basic Submissions", lessons: 5 },
      { title: "Ground Striking Intro", lessons: 4 },
    ],
  },
  {
    title: "Takedown Defense Essentials",
    slug: "takedown-defense-essentials",
    description: "Keep the fight where you want it. Sprawls, underhooks, and defensive wrestling for MMA.",
    shortDescription: "Fundamental takedown defense for MMA",
    modules: [
      { title: "Reading Takedowns", lessons: 4 },
      { title: "The Sprawl", lessons: 5 },
      { title: "Underhook Fighting", lessons: 5 },
      { title: "Cage Defense", lessons: 4 },
    ],
  },
  {
    title: "Clinch Fighting Basics",
    slug: "clinch-fighting-basics-mma",
    description: "The clinch is the crossroads of MMA. Learn strikes, takedowns, and defense from the clinch.",
    shortDescription: "MMA clinch fighting fundamentals",
    modules: [
      { title: "Clinch Positions", lessons: 4 },
      { title: "Clinch Striking", lessons: 5 },
      { title: "Takedowns from Clinch", lessons: 5 },
      { title: "Clinch Defense", lessons: 4 },
    ],
  },
  {
    title: "Combining Striking & Grappling",
    slug: "combining-striking-grappling",
    description: "The essence of MMA: seamlessly mixing strikes and grappling. Transitions and combinations.",
    shortDescription: "Integrating striking and grappling for MMA",
    modules: [
      { title: "Strike to Takedown", lessons: 5 },
      { title: "Takedown to Strike", lessons: 5 },
      { title: "Transitions", lessons: 5 },
      { title: "Building Combos", lessons: 4 },
    ],
  },
  {
    title: "MMA Cage Fundamentals",
    slug: "mma-cage-fundamentals",
    description: "The cage is unique to MMA. Learn to use it for offense and defense.",
    shortDescription: "Using the cage in MMA",
    modules: [
      { title: "Cage Striking", lessons: 4 },
      { title: "Cage Wrestling", lessons: 5 },
      { title: "Wall Walking", lessons: 5 },
      { title: "Cutting Off the Cage", lessons: 4 },
    ],
  },
  {
    title: "MMA Sparring Introduction",
    slug: "mma-sparring-introduction",
    description: "Your first MMA sparring sessions. Safety, technical sparring, and building confidence.",
    shortDescription: "Safe introduction to MMA sparring",
    modules: [
      { title: "Sparring Safety", lessons: 3 },
      { title: "Technical Sparring", lessons: 5 },
      { title: "Light MMA Sparring", lessons: 5 },
      { title: "Building Confidence", lessons: 4 },
    ],
  },
  {
    title: "MMA Conditioning Basics",
    slug: "mma-conditioning-basics",
    description: "Build the unique fitness needed for MMA. Cardio, strength, and sport-specific conditioning.",
    shortDescription: "Conditioning for MMA performance",
    modules: [
      { title: "MMA Cardio", lessons: 4 },
      { title: "Strength for MMA", lessons: 5 },
      { title: "Core Training", lessons: 4 },
      { title: "Recovery", lessons: 4 },
    ],
  },

  // INTERMEDIATE (10 courses)
  {
    title: "Ground & Pound Mastery",
    slug: "ground-and-pound-mastery-complete",
    description: "Finish fights from top position. Positioning, striking, and creating openings on the ground.",
    shortDescription: "Complete ground and pound system",
    featured: true,
    modules: [
      { title: "GnP Positioning", lessons: 5 },
      { title: "Strikes from Guard", lessons: 5 },
      { title: "Strikes from Side/Mount", lessons: 6 },
      { title: "Creating Finishes", lessons: 5 },
    ],
  },
  {
    title: "MMA Wrestling Complete",
    slug: "mma-wrestling-complete",
    description: "Advanced wrestling for MMA. Chain wrestling, cage wrestling, and defensive wrestling.",
    shortDescription: "Complete wrestling system for MMA",
    featured: true,
    modules: [
      { title: "Advanced Takedowns", lessons: 6 },
      { title: "Chain Wrestling", lessons: 5 },
      { title: "Cage Wrestling", lessons: 6 },
      { title: "Counter Wrestling", lessons: 5 },
    ],
  },
  {
    title: "Striker's MMA Toolbox",
    slug: "strikers-mma-toolbox",
    description: "For strikers transitioning to MMA. Keep the fight standing and finish with strikes.",
    shortDescription: "MMA strategies for strikers",
    modules: [
      { title: "Adapting Your Striking", lessons: 5 },
      { title: "Takedown Defense Plus", lessons: 6 },
      { title: "Getting Up", lessons: 5 },
      { title: "Cage Striking", lessons: 5 },
    ],
  },
  {
    title: "Grappler's MMA Toolbox",
    slug: "grapplers-mma-toolbox",
    description: "For grapplers transitioning to MMA. Get the fight to the ground and finish there.",
    shortDescription: "MMA strategies for grapplers",
    modules: [
      { title: "Setting Up Takedowns", lessons: 5 },
      { title: "Surviving Strikes", lessons: 5 },
      { title: "Ground Striking Defense", lessons: 5 },
      { title: "Submissions in MMA", lessons: 6 },
    ],
  },
  {
    title: "MMA Submissions",
    slug: "mma-submissions-complete",
    description: "Submissions that work in MMA with strikes involved. Guillotines, RNC, arm locks and more.",
    shortDescription: "High-percentage MMA submissions",
    modules: [
      { title: "Standing Submissions", lessons: 5 },
      { title: "Guillotine System", lessons: 6 },
      { title: "RNC in MMA", lessons: 5 },
      { title: "Arm Attacks", lessons: 5 },
    ],
  },
  {
    title: "Dirty Boxing for MMA",
    slug: "dirty-boxing-for-mma",
    description: "The art of fighting in the clinch. Underhooks, overhooks, and strikes in the pocket.",
    shortDescription: "Clinch striking and dirty boxing",
    modules: [
      { title: "Dirty Boxing Basics", lessons: 4 },
      { title: "Underhook Striking", lessons: 5 },
      { title: "Collar Ties & Strikes", lessons: 5 },
      { title: "Cage Dirty Boxing", lessons: 5 },
    ],
  },
  {
    title: "Getting Up & Standing",
    slug: "getting-up-standing",
    description: "Don't stay on the ground if you don't want to. Wall walking, technical stand ups, and scrambles.",
    shortDescription: "Escaping the ground and standing up",
    modules: [
      { title: "Technical Stand Up", lessons: 4 },
      { title: "Wall Walking", lessons: 5 },
      { title: "Scrambles", lessons: 6 },
      { title: "Cage Stand Ups", lessons: 4 },
    ],
  },
  {
    title: "MMA Clinch Complete",
    slug: "mma-clinch-complete",
    description: "Complete MMA clinch fighting. Thai clinch, wrestling clinch, and everything in between.",
    shortDescription: "Complete MMA clinch system",
    modules: [
      { title: "Clinch Positions", lessons: 5 },
      { title: "Clinch Striking", lessons: 6 },
      { title: "Clinch Takedowns", lessons: 6 },
      { title: "Clinch Defense", lessons: 5 },
    ],
  },
  {
    title: "Kicking in MMA",
    slug: "kicking-in-mma",
    description: "Use kicks effectively in MMA while managing takedown risk. Leg kicks, body kicks, and head kicks.",
    shortDescription: "Smart kicking for MMA with takedown awareness",
    modules: [
      { title: "Low Kicks in MMA", lessons: 5 },
      { title: "Body Kicks", lessons: 5 },
      { title: "Head Kicks", lessons: 5 },
      { title: "Kick Defense", lessons: 4 },
    ],
  },
  {
    title: "Fighting from Guard in MMA",
    slug: "fighting-from-guard-mma",
    description: "MMA-specific guard work. Avoiding damage, submissions, and stand ups from guard.",
    shortDescription: "MMA guard fighting and escapes",
    modules: [
      { title: "Guard Positioning", lessons: 4 },
      { title: "Defending GnP", lessons: 5 },
      { title: "Submissions from Guard", lessons: 6 },
      { title: "Standing Up from Guard", lessons: 4 },
    ],
  },

  // ADVANCED (10 courses)
  {
    title: "Elite Takedowns for MMA",
    slug: "elite-takedowns-mma",
    description: "High-level wrestling for MMA. Setups, timing, and chain wrestling used by UFC champions.",
    shortDescription: "Championship-level MMA wrestling",
    featured: true,
    modules: [
      { title: "Shot Setups", lessons: 6 },
      { title: "Level Changes", lessons: 5 },
      { title: "Advanced Chains", lessons: 6 },
      { title: "Counter Wrestling", lessons: 5 },
    ],
  },
  {
    title: "Pressure Fighting MMA",
    slug: "pressure-fighting-mma",
    description: "Walk down opponents and impose your will. Cage cutting, body work, and relentless pressure.",
    shortDescription: "Aggressive pressure fighting for MMA",
    modules: [
      { title: "Pressure Philosophy", lessons: 4 },
      { title: "Cage Cutting", lessons: 5 },
      { title: "Body Attack", lessons: 6 },
      { title: "Breaking Will", lessons: 5 },
    ],
  },
  {
    title: "Counter-Fighting in MMA",
    slug: "counter-fighting-mma",
    description: "Make opponents pay for every mistake. Timing, reading, and punishing attacks.",
    shortDescription: "Counter-striking system for MMA",
    modules: [
      { title: "Reading Opponents", lessons: 5 },
      { title: "Striking Counters", lessons: 6 },
      { title: "Takedown Counters", lessons: 5 },
      { title: "Setting Traps", lessons: 5 },
    ],
  },
  {
    title: "MMA Fight Strategy",
    slug: "mma-fight-strategy",
    description: "Build and execute game plans. Study opponents, adjust mid-fight, and outsmart competition.",
    shortDescription: "Strategic game planning for MMA",
    modules: [
      { title: "Building Game Plans", lessons: 5 },
      { title: "Studying Opponents", lessons: 5 },
      { title: "Mid-Fight Adjustments", lessons: 5 },
      { title: "Round Strategy", lessons: 4 },
    ],
  },
  {
    title: "Ground Control & Top Position",
    slug: "ground-control-top-position",
    description: "Dominate from top position. Control, transitions, and damage without losing position.",
    shortDescription: "MMA top control and ground dominance",
    modules: [
      { title: "Mounting & Staying", lessons: 5 },
      { title: "Side Control Domination", lessons: 5 },
      { title: "North-South Control", lessons: 4 },
      { title: "Back Control MMA", lessons: 5 },
    ],
  },
  {
    title: "Unorthodox MMA Techniques",
    slug: "unorthodox-mma-techniques",
    description: "Surprise opponents with unusual attacks. Spinning attacks, flying submissions, and creative techniques.",
    shortDescription: "Unorthodox and creative MMA techniques",
    modules: [
      { title: "Spinning Attacks", lessons: 5 },
      { title: "Flying Techniques", lessons: 5 },
      { title: "Unusual Submissions", lessons: 5 },
      { title: "Setting Up the Unusual", lessons: 4 },
    ],
  },
  {
    title: "MMA Competition Preparation",
    slug: "mma-competition-preparation",
    description: "Everything for your MMA debut or improving your competitive career. Camp, weight cut, and mindset.",
    shortDescription: "Complete MMA fight preparation",
    modules: [
      { title: "Fight Camp Structure", lessons: 4 },
      { title: "Weight Cutting", lessons: 5 },
      { title: "Fight Week", lessons: 5 },
      { title: "Mental Preparation", lessons: 5 },
    ],
  },
  {
    title: "Five Round Strategy",
    slug: "five-round-strategy",
    description: "Championship rounds require different preparation. Pacing, cardio, and late-round strategy.",
    shortDescription: "Strategy for 5-round championship fights",
    modules: [
      { title: "Pacing for 5 Rounds", lessons: 4 },
      { title: "Championship Cardio", lessons: 5 },
      { title: "Late Round Strategy", lessons: 5 },
      { title: "Finishing in Later Rounds", lessons: 4 },
    ],
  },
  {
    title: "Fighting Specific Styles",
    slug: "fighting-specific-styles",
    description: "Gameplans for different opponent styles. Wrestlers, strikers, grapplers, and southpaws.",
    shortDescription: "Strategies for different opponent types",
    modules: [
      { title: "vs Wrestlers", lessons: 5 },
      { title: "vs Strikers", lessons: 5 },
      { title: "vs Grapplers", lessons: 5 },
      { title: "vs Southpaws", lessons: 4 },
    ],
  },
  {
    title: "Developing Your MMA Style",
    slug: "developing-your-mma-style",
    description: "Find and develop your unique fighting identity. Combine your strengths into a cohesive game.",
    shortDescription: "Building your unique MMA fighting style",
    modules: [
      { title: "Identifying Strengths", lessons: 4 },
      { title: "Building Your A-Game", lessons: 5 },
      { title: "Addressing Weaknesses", lessons: 5 },
      { title: "Putting It Together", lessons: 4 },
    ],
  },
];

// Helper function to create modules and lessons
function createModulesData(modules: Array<{ title: string; lessons: number }>) {
  return modules.map((module, moduleIndex) => ({
    title: module.title,
    order: moduleIndex,
    lessons: {
      create: Array.from({ length: module.lessons }, (_, lessonIndex) => ({
        title: `Lesson ${lessonIndex + 1}`,
        order: lessonIndex,
        videoDuration: 600 + Math.floor(Math.random() * 600), // 10-20 min
        isPublished: true,
        isFreePreview: moduleIndex === 0 && lessonIndex === 0,
      })),
    },
  }));
}

async function main() {
  console.log("Seeding complete course catalog (90 courses)...\n");

  // Get or create coaches
  const coaches: Record<string, string> = {};

  for (const [discipline, emails] of Object.entries(coachEmails)) {
    for (const email of emails) {
      const existingCoach = await prisma.user.findFirst({
        where: { email },
      });

      if (existingCoach) {
        coaches[email] = existingCoach.id;
      } else {
        const [first, last] = email.split("@")[0].split(".");
        const newCoach = await prisma.user.create({
          data: {
            clerkId: `coach_${email.replace(/[@.]/g, "_")}`,
            email,
            firstName: first.charAt(0).toUpperCase() + first.slice(1),
            lastName: last.charAt(0).toUpperCase() + last.slice(1),
            role: Role.COACH,
            subscriptionStatus: "ACTIVE",
          },
        });
        coaches[email] = newCoach.id;
        console.log(`Created coach: ${email}`);
      }
    }
  }

  // Seed GRAPPLING courses
  console.log("\n=== GRAPPLING COURSES ===");
  let grapplingCount = 0;
  for (const course of grapplingCourses) {
    const existing = await prisma.course.findUnique({
      where: { slug: course.slug },
    });

    if (existing) {
      console.log(`  Skipping: ${course.title}`);
      continue;
    }

    const coachEmail = coachEmails.grappling[grapplingCount % coachEmails.grappling.length];
    await prisma.course.create({
      data: {
        title: course.title,
        slug: course.slug,
        description: course.description,
        shortDescription: course.shortDescription,
        discipline: Discipline.GRAPPLING,
        language: Language.EN,
        status: CourseStatus.PUBLISHED,
        featured: course.featured || false,
        coachId: coaches[coachEmail],
        publishedAt: new Date(),
        modules: {
          create: createModulesData(course.modules),
        },
      },
    });
    console.log(`  Created: ${course.title}`);
    grapplingCount++;
  }
  console.log(`  Total Grappling: ${grapplingCount} new courses`);

  // Seed KICKBOXING courses
  console.log("\n=== KICKBOXING COURSES ===");
  let kickboxingCount = 0;
  for (const course of kickboxingCourses) {
    const existing = await prisma.course.findUnique({
      where: { slug: course.slug },
    });

    if (existing) {
      console.log(`  Skipping: ${course.title}`);
      continue;
    }

    const coachEmail = coachEmails.kickboxing[kickboxingCount % coachEmails.kickboxing.length];
    await prisma.course.create({
      data: {
        title: course.title,
        slug: course.slug,
        description: course.description,
        shortDescription: course.shortDescription,
        discipline: Discipline.KICKBOXING,
        language: Language.EN,
        status: CourseStatus.PUBLISHED,
        featured: course.featured || false,
        coachId: coaches[coachEmail],
        publishedAt: new Date(),
        modules: {
          create: createModulesData(course.modules),
        },
      },
    });
    console.log(`  Created: ${course.title}`);
    kickboxingCount++;
  }
  console.log(`  Total Kickboxing: ${kickboxingCount} new courses`);

  // Seed MMA courses
  console.log("\n=== MMA COURSES ===");
  let mmaCount = 0;
  for (const course of mmaCourses) {
    const existing = await prisma.course.findUnique({
      where: { slug: course.slug },
    });

    if (existing) {
      console.log(`  Skipping: ${course.title}`);
      continue;
    }

    const coachEmail = coachEmails.mma[mmaCount % coachEmails.mma.length];
    await prisma.course.create({
      data: {
        title: course.title,
        slug: course.slug,
        description: course.description,
        shortDescription: course.shortDescription,
        discipline: Discipline.MMA,
        language: Language.EN,
        status: CourseStatus.PUBLISHED,
        featured: course.featured || false,
        coachId: coaches[coachEmail],
        publishedAt: new Date(),
        modules: {
          create: createModulesData(course.modules),
        },
      },
    });
    console.log(`  Created: ${course.title}`);
    mmaCount++;
  }
  console.log(`  Total MMA: ${mmaCount} new courses`);

  // Summary
  console.log("\n=== SUMMARY ===");
  const totalCourses = await prisma.course.count();
  const totalLessons = await prisma.lesson.count();
  console.log(`Total courses in database: ${totalCourses}`);
  console.log(`Total lessons in database: ${totalLessons}`);

  const byDiscipline = await prisma.course.groupBy({
    by: ["discipline"],
    _count: true,
  });
  console.log("\nBy discipline:");
  byDiscipline.forEach((d) => {
    console.log(`  ${d.discipline}: ${d._count} courses`);
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
