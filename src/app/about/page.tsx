import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Trophy,
  Target,
  Heart,
  Users,
  Globe,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Roots Online Academy - our mission to make world-class martial arts instruction accessible to everyone, everywhere.",
  openGraph: {
    title: "About Us | ROA",
    description:
      "Learn about Roots Online Academy - our mission to make world-class martial arts instruction accessible to everyone.",
    url: `${siteConfig.url}/about`,
  },
};

const values = [
  {
    icon: Trophy,
    title: "Excellence",
    description:
      "We partner only with proven champions and elite instructors who have competed at the highest levels.",
  },
  {
    icon: Target,
    title: "Accessibility",
    description:
      "World-class instruction shouldn't be limited by geography or budget. We make it available to everyone.",
  },
  {
    icon: Heart,
    title: "Passion",
    description:
      "Every coach on our platform shares a genuine love for teaching and helping students grow.",
  },
  {
    icon: Users,
    title: "Community",
    description:
      "We're building a global community of martial artists who support and inspire each other.",
  },
];

const stats = [
  { value: "50+", label: "Expert Coaches" },
  { value: "200+", label: "HD Courses" },
  { value: "10K+", label: "Students Worldwide" },
  { value: "3", label: "Disciplines" },
];

const team = [
  {
    name: "Your Name",
    role: "Founder & CEO",
    bio: "Former competitive martial artist with a vision to democratize access to elite instruction.",
    image: null,
  },
  {
    name: "Head Coach",
    role: "Chief Curriculum Officer",
    bio: "Multiple-time world champion responsible for course quality and coach selection.",
    image: null,
  },
  {
    name: "Tech Lead",
    role: "CTO",
    bio: "Building the platform that delivers world-class instruction to your screen.",
    image: null,
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black py-20 lg:py-28">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='white'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`
        }} />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Martial Arts for
              <span className="block text-primary">Everyone, Everywhere</span>
            </h1>
            <p className="mt-6 text-lg text-gray-300">
              ROA was born from a simple idea: the best martial arts instruction
              in the world shouldn't be limited to those lucky enough to live
              near a top gym. We're changing that.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold">{stat.value}</div>
                <div className="mt-1 text-sm opacity-80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Our Mission
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                We believe everyone deserves access to world-class martial arts
                instruction, regardless of where they live or their budget.
              </p>
              <p className="mt-4 text-muted-foreground">
                Traditional martial arts education has always been limited by
                geography. The best coaches are concentrated in major cities,
                and private instruction costs hundreds per hour. We're building
                the solution.
              </p>
              <p className="mt-4 text-muted-foreground">
                By partnering with elite coaches - world champions, UFC veterans,
                and legendary instructors - we bring their knowledge directly to
                you through professionally produced HD video courses.
              </p>

              <div className="mt-8">
                <Link href="/courses">
                  <Button size="lg">
                    Explore Our Courses
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <Globe className="h-32 w-32 text-primary/40" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Our Values
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              These principles guide everything we do at ROA
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <Card key={value.title} className="text-center p-6">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <value.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 font-semibold">{value.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {value.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Meet the Team
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              The passionate people behind ROA
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
            {team.map((member) => (
              <Card key={member.name} className="text-center p-6">
                <div className="mx-auto h-24 w-24 rounded-full bg-muted flex items-center justify-center text-2xl font-bold text-muted-foreground">
                  {member.name.charAt(0)}
                </div>
                <h3 className="mt-4 font-semibold">{member.name}</h3>
                <p className="text-sm text-primary">{member.role}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {member.bio}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose ROA */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Why Train With ROA?
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
            {[
              "Learn from world champions and elite coaches",
              "HD video with multiple angles and slow motion",
              "Train on your schedule, at your pace",
              "New courses and content added weekly",
              "Fraction of the cost of private instruction",
              "Access on any device, anywhere in the world",
              "Structured curriculum from basics to advanced",
              "Community of dedicated martial artists",
            ].map((feature) => (
              <div key={feature} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to Start Your Journey?
          </h2>
          <p className="mt-4 text-lg opacity-90 max-w-2xl mx-auto">
            Join thousands of martial artists already training with ROA. Start
            your 7-day free trial today.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up">
              <Button size="xl" variant="secondary" className="w-full sm:w-auto">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/courses">
              <Button
                size="xl"
                variant="outline"
                className="w-full sm:w-auto border-white/20 hover:bg-white/10"
              >
                Browse Courses
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
