import Link from "next/link";
import { ArrowRight, Target, Flame, Shield } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const disciplines = [
  {
    name: "MMA",
    slug: "MMA",
    icon: Target,
    color: "bg-red-500",
    description:
      "Mixed Martial Arts combines techniques from various combat sports. Learn to seamlessly blend striking and grappling for complete fighting ability.",
    features: [
      "Striking techniques (punches, kicks, elbows, knees)",
      "Clinch work and dirty boxing",
      "Takedowns and takedown defense",
      "Ground and pound",
      "Cage work and wall wrestling",
    ],
    courseCount: 12,
  },
  {
    name: "Kickboxing",
    slug: "KICKBOXING",
    icon: Flame,
    color: "bg-orange-500",
    description:
      "Master the art of stand-up fighting. Our kickboxing courses cover everything from basic techniques to advanced combinations and ring strategy.",
    features: [
      "Boxing fundamentals",
      "Kick techniques (all ranges)",
      "Footwork and movement",
      "Defensive techniques",
      "Combination building",
    ],
    courseCount: 8,
  },
  {
    name: "Grappling",
    slug: "GRAPPLING",
    icon: Shield,
    color: "bg-blue-500",
    description:
      "Develop world-class ground skills. Learn wrestling, Brazilian Jiu-Jitsu, and submission grappling from championship-level instructors.",
    features: [
      "Takedowns and throws",
      "Guard work and passing",
      "Submissions and escapes",
      "Positional control",
      "Competition strategies",
    ],
    courseCount: 15,
  },
];

export default function DisciplinesPage() {
  return (
    <div className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Training Disciplines
          </h1>
          <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose your path in martial arts. Each discipline offers unique
            techniques and training methodologies.
          </p>
        </div>

        {/* Disciplines Grid */}
        <div className="space-y-12">
          {disciplines.map((discipline, index) => (
            <Card
              key={discipline.name}
              className="overflow-hidden"
            >
              <div
                className={`grid md:grid-cols-2 ${
                  index % 2 === 1 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Image/Color section */}
                <div
                  className={`${discipline.color} p-12 flex items-center justify-center min-h-[300px] ${
                    index % 2 === 1 ? "md:order-2" : ""
                  }`}
                >
                  <div className="text-center text-white">
                    <discipline.icon className="h-24 w-24 mx-auto mb-4 opacity-90" />
                    <h2 className="text-4xl font-bold">{discipline.name}</h2>
                  </div>
                </div>

                {/* Content section */}
                <CardContent className="p-8 md:p-12">
                  <p className="text-lg text-muted-foreground">
                    {discipline.description}
                  </p>

                  <h3 className="font-semibold mt-6 mb-4">What you'll learn:</h3>
                  <ul className="space-y-2">
                    {discipline.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {discipline.courseCount}+ courses available
                    </span>
                    <Link href={`/courses?discipline=${discipline.slug}`}>
                      <Button>
                        Browse Courses
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <h2 className="text-2xl font-bold">Not Sure Where to Start?</h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Our MMA Fundamentals course is perfect for beginners and covers
            techniques from all three disciplines.
          </p>
          <Link href="/courses?discipline=MMA" className="inline-block mt-6">
            <Button size="lg">
              Start with MMA Fundamentals
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
