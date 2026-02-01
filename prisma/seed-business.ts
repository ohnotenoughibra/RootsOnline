import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Sample business Q&A content
const businessQuestions = [
  {
    title: "What's the ideal member-to-mat-space ratio for a BJJ gym?",
    content: `I'm planning to open a 2,500 sq ft BJJ gym and trying to figure out the maximum class sizes I should run.

Currently thinking 800 sq ft of mat space with the rest for lobby, changing rooms, and small retail area. What's a good ratio of members per class to mat space? I want people to have enough room to roll but also need to make the numbers work financially.

Also curious about peak hours - how many classes can realistically run back-to-back before mats need cleaning/rest?`,
    category: "FACILITIES",
    isAnswered: true,
    isPinned: true,
  },
  {
    title: "How do you handle pricing for families with multiple kids in classes?",
    content: `We have quite a few families with 2-3 kids training at our gym. Currently charging full price for each kid but getting pushback from parents.

What family discount structures work well? I've seen:
- 2nd child 50% off, 3rd+ free
- Flat family rate regardless of number
- 10-15% off per additional child

What have you found works best for retention while still being profitable?`,
    category: "FINANCE",
    isAnswered: false,
  },
  {
    title: "Best CRM/management software for a small MMA gym?",
    content: `Running a gym with about 150 members. Currently using spreadsheets and it's becoming unmanageable. Need something for:

- Member management and billing
- Class scheduling and check-ins
- Automated emails/texts for retention
- Basic reporting

Budget is around $100-200/month. Looked at Zen Planner, Mindbody, and Wodify. What do you all use and recommend? Any hidden costs I should watch for?`,
    category: "TECHNOLOGY",
    isAnswered: true,
  },
  {
    title: "Running your first in-house competition - lessons learned?",
    content: `Planning our first in-house BJJ tournament next month. About 60 participants expected across all belt levels.

Would love to hear from those who've done this:
- How many mats/referees do you need?
- Best bracket software?
- Food/vendor considerations?
- Insurance requirements?
- How do you handle registration and weigh-ins efficiently?

Any major mistakes to avoid would be super helpful!`,
    category: "EVENTS",
    isAnswered: false,
    isPinned: true,
  },
  {
    title: "Strategies for retaining members past the 6-month mark",
    content: `We're seeing a pattern where many members drop off around 5-6 months. They get past the initial excitement, hit a plateau, and disappear.

What retention strategies work for you at this stage? Currently we do:
- Monthly goal-setting sessions
- Quarterly testing/promotions
- Social events

But still losing too many people. Open to ideas on curriculum changes, community building, or anything else that's worked.`,
    category: "COMMUNITY",
    isAnswered: true,
  },
  {
    title: "Hiring your first full-time instructor - what salary range?",
    content: `My gym has grown to the point where I can't teach all classes myself. Looking to hire a full-time instructor (around 25-30 classes per week including kids, fundamentals, and some advanced).

For a mid-sized US city (not NYC/LA), what's a reasonable salary range? Should I do salary, hourly, or per-class pay? Benefits?

Also, how did you structure the interview/trial process?`,
    category: "STAFFING",
    isAnswered: false,
  },
  {
    title: "Liability waiver best practices - what should be included?",
    content: `Getting our liability waivers updated and want to make sure we're covered. Current waiver is pretty basic and was written 5 years ago.

What specific clauses do you include? Especially interested in:
- COVID-related language
- Photo/video consent
- Minor waivers and parental responsibility
- Sparring/competition specific releases

Anyone have a lawyer they'd recommend who specializes in martial arts businesses?`,
    category: "LEGAL",
    isAnswered: true,
  },
  {
    title: "Marketing strategies that actually work for martial arts gyms",
    content: `Spent $2k on Facebook ads last month and got 3 trials, 1 sign-up. That's not sustainable.

What marketing channels are actually working for you in 2024? I've tried:
- Facebook/Instagram ads (poor results)
- Google ads (expensive, okay results)
- Referral program (best so far)

Thinking about trying TikTok, local SEO, or community partnerships. What's your marketing mix and rough budget allocation?`,
    category: "MARKETING",
    isAnswered: true,
  },
  {
    title: "How to structure a kids program for different age groups",
    content: `Starting a kids program at our MMA gym. Want to do it right from the beginning.

How do you structure age groups? Thinking:
- Little Warriors (4-6)
- Junior (7-10)
- Teens (11-15)

Is this too segmented for a gym with maybe 30-40 kids total? How long should classes be for each age group? What's the ideal kids-to-instructor ratio?`,
    category: "GYM_OPERATIONS",
    isAnswered: false,
  },
  {
    title: "When is the right time to expand to a second location?",
    content: `Our gym is consistently at 90%+ capacity for prime time classes. Waiting lists for some programs. Revenue is strong and we've been profitable for 3 years.

Thinking about opening a second location 20 minutes away in a growing suburb. But I'm nervous about:
- Diluting the community
- Managing two locations
- The financial risk

For those who've expanded: what metrics told you it was time? How did you handle the transition? Any regrets?`,
    category: "GROWTH",
    isAnswered: true,
  },
];

// Sample answers for answered questions
const sampleAnswers = [
  {
    questionIndex: 0, // Mat space question
    content: `Great question! Here's what I've learned running a 3,000 sq ft gym for 8 years:

**Mat Space Ratio:**
- For BJJ drilling: 50 sq ft per person minimum
- For rolling/sparring: 80-100 sq ft per person
- Your 800 sq ft should handle 8-10 people rolling comfortably, 12-16 drilling

**Class Size Formula:**
Mat square footage ÷ 70 = comfortable class size for mixed drilling/rolling

**Back-to-back classes:**
We run 3-4 classes before a proper mop. Quick spray between classes. Full cleaning after kids classes (they're dirtier than adults, trust me).

**Pro tip:** Build in 15-minute gaps between classes. Gives time for cleaning, socializing (which builds community), and prevents the "rush out" feeling.`,
    isAccepted: true,
  },
  {
    questionIndex: 2, // CRM question
    content: `Tried most of them. Here's my honest take after 6 years:

**Zen Planner** - Best for martial arts specifically. Built-in belt tracking, good automations. ~$150/month for your size. Cons: interface feels dated.

**PushPress** - My current choice. Modern interface, great mobile app for members, solid reporting. ~$175/month. Best customer support I've experienced.

**Mindbody** - Overkill for martial arts. Better for yoga studios. Hidden fees everywhere.

**Hidden costs to watch:**
- Payment processing fees (negotiate these!)
- SMS fees (can add $50-100/month)
- Migration/setup fees
- Per-member fees above certain thresholds

Whatever you choose, factor in 2-3 months of running parallel systems during migration. Don't cut over cold turkey.`,
    isAccepted: true,
  },
  {
    questionIndex: 4, // Retention question
    content: `The 6-month wall is real. Here's what moved the needle for us:

**Curriculum Changes:**
- Introduced a "fundamentals graduation" at 6 months with a mini-ceremony
- Created intermediate-specific classes so they're not lost between beginners and advanced
- Monthly technique challenges with leaderboard

**Community:**
- Buddy system pairing new members with 1-year+ members
- "Bring a training partner to lunch" monthly events
- Private Facebook group with daily engagement (technique videos, memes, wins)

**Personal Touch:**
- Coach check-ins at 2, 4, and 6 month marks (scheduled, not random)
- Personalized video feedback on their progress
- "Why you matter to our community" note at 6 months

The last one sounds cheesy but has the highest impact. People stay for relationships, not techniques.

Retention went from 62% to 78% at the 6-month mark after implementing these.`,
    isAccepted: true,
  },
];

// Business resources
const businessResources = [
  {
    title: "New Member Onboarding Checklist",
    description: "Complete checklist for onboarding new members including paperwork, intro class scheduling, equipment recommendations, and first-week touchpoints.",
    category: "GYM_OPERATIONS",
    resourceType: "CHECKLIST",
    isFree: true,
    content: `# New Member Onboarding Checklist

## Day 1 - Sign Up
- [ ] Complete membership agreement
- [ ] Collect emergency contact information
- [ ] Take profile photo for system
- [ ] Process first payment
- [ ] Add to gym management software
- [ ] Send welcome email with class schedule
- [ ] Add to communication channels (WhatsApp/Facebook group)

## First Week
- [ ] Schedule intro private (if included)
- [ ] Assign training buddy
- [ ] Coach introduction during first class
- [ ] Follow-up call/text after first class
- [ ] Equipment recommendations sent

## First Month
- [ ] Check-in call at 2 weeks
- [ ] Goal-setting session scheduled
- [ ] Invite to first social event
- [ ] Review and adjust schedule if needed

## 90-Day Milestone
- [ ] Progress review meeting
- [ ] Testimonial/review request
- [ ] Referral program introduction`,
  },
  {
    title: "Class Pricing Calculator Spreadsheet",
    description: "Excel template to calculate optimal class pricing based on expenses, target profit margin, and local market analysis.",
    category: "FINANCE",
    resourceType: "SPREADSHEET",
    isFree: false,
  },
  {
    title: "Competition Event Planning Guide",
    description: "Step-by-step guide to planning and executing in-house tournaments including timelines, equipment lists, staff requirements, and marketing templates.",
    category: "EVENTS",
    resourceType: "GUIDE",
    isFree: false,
  },
  {
    title: "Instructor Employment Contract Template",
    description: "Customizable employment contract template for martial arts instructors covering compensation, non-compete clauses, and liability provisions.",
    category: "STAFFING",
    resourceType: "TEMPLATE",
    isFree: false,
  },
  {
    title: "Social Media Content Calendar",
    description: "30-day content calendar specifically for martial arts gyms with post ideas, optimal timing, and engagement strategies.",
    category: "MARKETING",
    resourceType: "TEMPLATE",
    isFree: true,
    content: `# 30-Day Social Media Content Calendar for Martial Arts Gyms

## Content Pillars
1. **Education** (40%) - Technique tips, training advice
2. **Community** (30%) - Member spotlights, class photos, events
3. **Motivation** (20%) - Quotes, transformation stories
4. **Promotion** (10%) - Offers, new programs, trials

## Weekly Schedule

### Monday - Motivation
- Morning: Motivational quote with gym branding
- Stories: "Monday grind" class footage

### Tuesday - Technique
- Post: Quick tip video (30-60 seconds)
- Stories: "Technique of the week" series

### Wednesday - Community
- Post: Member spotlight or testimonial
- Stories: Behind-the-scenes, coach day-in-life

### Thursday - Education
- Post: Training advice, nutrition tips, recovery
- Stories: Q&A or polls

### Friday - Hype
- Post: Weekend class schedule, event reminders
- Stories: "Friday rolls" highlights

### Saturday - Action
- Post: Class/event photos from the week
- Stories: Live from open mat/competition

### Sunday - Preview
- Post: Week ahead preview, upcoming events
- Stories: Rest day content, coach recommendations

## Best Posting Times
- Instagram: 6-7am, 12pm, 7-8pm
- Facebook: 9am, 1pm, 4pm
- TikTok: 7-9am, 12-3pm, 7-11pm`,
  },
  {
    title: "Member Retention Email Sequences",
    description: "Pre-written email sequences for key retention touchpoints: welcome series, re-engagement, milestone celebrations, and win-back campaigns.",
    category: "COMMUNITY",
    resourceType: "TEMPLATE",
    isFree: false,
  },
  {
    title: "Gym Layout & Equipment Guide",
    description: "Comprehensive guide to gym layout optimization, essential equipment lists by discipline, and vendor recommendations.",
    category: "FACILITIES",
    resourceType: "GUIDE",
    isFree: true,
    content: `# Gym Layout & Equipment Guide

## Essential Mat Space Ratios
- **BJJ/Grappling:** 70-100 sq ft per person rolling
- **Striking:** 50-70 sq ft per person
- **Kids classes:** 40-50 sq ft per child

## Recommended Layout Flow
1. **Entry/Reception** - First impression, retail display
2. **Viewing area** - Parents, prospects can watch
3. **Main mat space** - Largest area, center of gym
4. **Secondary training area** - Bags, conditioning
5. **Changing rooms** - Easy access from mat
6. **Storage** - Equipment, cleaning supplies

## Essential Equipment by Discipline

### BJJ/Grappling
- Competition-grade puzzle mats (minimum 1.5")
- Wall padding for takedown areas
- Grappling dummies (2-3 sizes)
- Resistance bands
- Timer system (visible/audible)

### MMA/Striking
- Heavy bags (various weights)
- Thai pads
- Focus mitts
- Kick shields
- Boxing ring or cage (if space)

### General
- First aid kit (well-stocked)
- AED device
- Sound system
- Mirrors (striking areas)
- Fans/AC units
- Water station

## Vendor Recommendations
- **Mats:** Dollamur, Zebra, IncStores
- **Bags:** Fairtex, Outslayer, Century
- **Gear:** Sanabul (budget), Hayabusa (premium)`,
  },
];

async function main() {
  console.log("Seeding business content...");

  // Get or create a system user for Q&A content
  let systemUser = await prisma.user.findFirst({
    where: { email: "admin@rootscollective.com" },
  });

  if (!systemUser) {
    // Create a placeholder admin user for seeded content
    systemUser = await prisma.user.create({
      data: {
        clerkId: "system_business_seed",
        email: "admin@rootscollective.com",
        firstName: "Roots",
        lastName: "Admin",
        role: "ADMIN",
      },
    });
    console.log("Created system admin user");
  }

  // Seed business questions
  console.log("Seeding business questions...");
  const createdQuestions = [];

  for (const q of businessQuestions) {
    const question = await prisma.businessQuestion.create({
      data: {
        userId: systemUser.id,
        title: q.title,
        content: q.content,
        category: q.category as any,
        isAnswered: q.isAnswered,
        isPinned: q.isPinned || false,
        viewCount: Math.floor(Math.random() * 500) + 50,
      },
    });
    createdQuestions.push(question);
    console.log(`  Created question: ${q.title.substring(0, 50)}...`);
  }

  // Seed answers for answered questions
  console.log("Seeding answers...");
  for (const answer of sampleAnswers) {
    const question = createdQuestions[answer.questionIndex];
    if (question) {
      await prisma.businessAnswer.create({
        data: {
          userId: systemUser.id,
          questionId: question.id,
          content: answer.content,
          isAccepted: answer.isAccepted || false,
          upvotes: Math.floor(Math.random() * 30) + 5,
        },
      });
      console.log(`  Created answer for question ${answer.questionIndex + 1}`);
    }
  }

  // Seed business resources
  console.log("Seeding business resources...");
  for (const resource of businessResources) {
    await prisma.businessResource.create({
      data: {
        title: resource.title,
        description: resource.description,
        category: resource.category as any,
        resourceType: resource.resourceType,
        isFree: resource.isFree,
        content: resource.content || null,
        downloadCount: Math.floor(Math.random() * 200) + 10,
      },
    });
    console.log(`  Created resource: ${resource.title}`);
  }

  console.log("\nBusiness content seeding completed!");
  console.log(`- ${createdQuestions.length} questions created`);
  console.log(`- ${sampleAnswers.length} answers created`);
  console.log(`- ${businessResources.length} resources created`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
