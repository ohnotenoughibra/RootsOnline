import type { Metadata } from "next";
import Link from "next/link";
import {
  Trophy,
  Target,
  Heart,
  Users,
  ArrowRight,
  MapPin,
  BookOpen,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Roots Online Academy - our mission to make quality martial arts instruction accessible to everyone.",
  openGraph: {
    title: "About Us | ROA",
    description:
      "Learn about Roots Online Academy - our mission to make quality martial arts instruction accessible to everyone.",
    url: `${siteConfig.url}/about`,
  },
};

const values = [
  {
    icon: Trophy,
    title: "Excellence",
    description: "We work with proven coaches who have competed at the highest levels.",
  },
  {
    icon: Target,
    title: "Accessibility",
    description: "Quality instruction available to everyone, regardless of location.",
  },
  {
    icon: Heart,
    title: "Passion",
    description: "Every coach shares a genuine love for teaching and helping students grow.",
  },
  {
    icon: Users,
    title: "Community",
    description: "A global community of martial artists who support and inspire each other.",
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section - Minimal */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            About ROA
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            We believe quality martial arts instruction should be accessible to everyone.
            From Innsbruck, we're building a platform that connects martial artists worldwide.
          </p>
        </div>
      </section>

      {/* Highlights */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 text-center">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Growing Community</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">3 Disciplines</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Based in Innsbruck</span>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Our Mission
          </h2>
          <p className="mt-6 text-muted-foreground">
            Traditional martial arts education has always been limited by geography.
            The best coaches are concentrated in major cities, and private instruction
            is expensive. We're building a solution.
          </p>
          <p className="mt-4 text-muted-foreground">
            By working with elite coaches, we bring their knowledge directly to you
            through professionally produced video courses. Learn together, grow together.
          </p>
          <div className="mt-8">
            <Link href="/courses">
              <Button size="lg">
                Explore Courses
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Our Values
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 max-w-4xl mx-auto">
            {values.map((value) => (
              <div key={value.title} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border-2">
                  <value.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-medium">{value.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              What We Offer
            </h2>
          </div>

          <div className="space-y-4">
            {[
              "Train at your own pace, on your schedule",
              "New courses and content added weekly",
              "Access on any device, anywhere",
              "Structured curriculum from beginner to advanced",
              "Community of dedicated martial artists",
              "Personal feedback from coaches",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3 p-4 border rounded-lg">
                <div className="h-2 w-2 rounded-full bg-foreground shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Minimal */}
      <section className="py-20 border-t">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Ready to start?
          </h2>
          <p className="mt-4 text-muted-foreground">
            Join our growing community of martial artists. Start your free trial today.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up">
              <Button size="xl">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/courses">
              <Button size="xl" variant="outline">
                Browse Courses
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
