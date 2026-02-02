"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Dumbbell, Users, Briefcase, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const interests = [
  {
    id: "training",
    name: "Train & Learn",
    icon: Dumbbell,
    description: "Learn MMA, kickboxing, and grappling from world-class coaches",
    disciplines: [
      {
        name: "MMA",
        slug: "MMA",
        description: "The complete game — striking, grappling, and everything in between",
      },
      {
        name: "Kickboxing",
        slug: "KICKBOXING",
        description: "Punches, kicks, and the footwork that ties it all together",
      },
      {
        name: "Grappling",
        slug: "GRAPPLING",
        description: "Takedowns, submissions, and positional control",
      },
    ],
    cta: { text: "Browse Courses", href: "/courses" },
  },
  {
    id: "business",
    name: "Run a Gym",
    icon: Briefcase,
    description: "Learn how to build and scale a successful martial arts business",
    topics: [
      "Gym Operations & Systems",
      "Marketing & Growth",
      "Events & Competitions",
      "Community Building",
      "Finance & Pricing",
    ],
    cta: { text: "Explore Business Academy", href: "/business" },
  },
  {
    id: "community",
    name: "Join Community",
    icon: Users,
    description: "Connect with practitioners and gym owners worldwide",
    features: [
      "Q&A with experienced coaches",
      "Training partner finder",
      "Technique discussions",
      "Business advice forums",
    ],
    cta: { text: "Get Started", href: "/sign-up" },
  },
];

export default function HomePage() {
  const [selectedInterest, setSelectedInterest] = useState<string | null>(null);

  const selected = interests.find((i) => i.id === selectedInterest);

  return (
    <div className="flex flex-col">
      {/* Hero - Simple and Direct */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Train with us.
            <span className="block text-muted-foreground">Grow together.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            We're ROA — a group of friends building something for
            the martial arts community. Learn techniques, grow your gym,
            and connect with practitioners who share your passion.
          </p>
        </div>
      </section>

      {/* Interest Selection */}
      <section className="py-16 border-t bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-center mb-2">
            What brings you here?
          </h2>
          <p className="text-center text-muted-foreground mb-8">
            Select what you're interested in
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            {interests.map((interest) => (
              <button
                key={interest.id}
                onClick={() => setSelectedInterest(
                  selectedInterest === interest.id ? null : interest.id
                )}
                className={cn(
                  "text-left p-6 rounded-xl border-2 transition-all",
                  selectedInterest === interest.id
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                )}
              >
                <interest.icon className={cn(
                  "h-8 w-8 mb-3",
                  selectedInterest === interest.id
                    ? "text-primary"
                    : "text-muted-foreground"
                )} />
                <h3 className="font-semibold text-lg">{interest.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {interest.description}
                </p>
              </button>
            ))}
          </div>

          {/* Expanded Content */}
          {selected && (
            <div className="mt-8 p-6 rounded-xl border bg-card animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold">{selected.name}</h3>
                  <p className="text-muted-foreground">{selected.description}</p>
                </div>
                <Link href={selected.cta.href}>
                  <Button>
                    {selected.cta.text}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>

              {/* Training disciplines */}
              {"disciplines" in selected && selected.disciplines && (
                <div className="grid gap-3 mt-4">
                  {selected.disciplines.map((discipline) => (
                    <Link
                      key={discipline.name}
                      href={`/courses?discipline=${discipline.slug}`}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors group"
                    >
                      <div>
                        <h4 className="font-medium">{discipline.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {discipline.description}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </Link>
                  ))}
                </div>
              )}

              {/* Business topics */}
              {"topics" in selected && (
                <div className="grid sm:grid-cols-2 gap-2 mt-4">
                  {selected.topics.map((topic) => (
                    <div
                      key={topic}
                      className="flex items-center gap-2 p-3 rounded-lg bg-muted/50"
                    >
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span className="text-sm">{topic}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Community features */}
              {"features" in selected && (
                <div className="grid sm:grid-cols-2 gap-2 mt-4">
                  {selected.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-2 p-3 rounded-lg bg-muted/50"
                    >
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Quick Links - Disciplines */}
      <section className="py-16 border-t">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight">What We Teach</h2>
          <div className="mt-8 space-y-4">
            {interests[0].disciplines?.map((discipline) => (
              <Link
                key={discipline.name}
                href={`/courses?discipline=${discipline.slug}`}
              >
                <Card className="group hover:bg-muted/50 transition-colors">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{discipline.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {discipline.description}
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </CardContent>
                </Card>
              </Link>
            ))}
            {/* Business Academy Card */}
            <Link href="/business">
              <Card className="group hover:bg-muted/50 transition-colors border-dashed">
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Business Academy</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Run a successful gym — operations, marketing, events, and more
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-16 border-t bg-muted/30">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight">What You Get</h2>
          <div className="mt-8 space-y-4 text-muted-foreground">
            <p>
              <span className="text-foreground font-medium">Video courses</span>{" "}
              — Structured lessons from basics to advanced techniques. Watch on
              any device, pause, rewind, go at your own pace.
            </p>
            <p>
              <span className="text-foreground font-medium">Coach feedback</span>{" "}
              — Submit videos of your training and get real feedback from our
              coaches. Not AI, not templates — actual humans who train.
            </p>
            <p>
              <span className="text-foreground font-medium">Community</span>{" "}
              — Connect with other practitioners. Ask questions, share progress,
              find training partners.
            </p>
            <p>
              <span className="text-foreground font-medium">Business resources</span>{" "}
              — For gym owners: courses, templates, and a community of
              experienced operators to learn from.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing - Simple and Honest */}
      <section className="py-16 border-t">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight">Pricing</h2>
          <p className="mt-4 text-muted-foreground">
            One price. Full access. No upsells.
          </p>

          <Card className="mt-8 p-8">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold">€19.99</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              or €199/year (save 17%)
            </p>
            <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
              <li>• All courses, all disciplines</li>
              <li>• Business Academy included</li>
              <li>• New content as we release it</li>
              <li>• Coach feedback on your training</li>
              <li>• Cancel anytime, no questions</li>
            </ul>
            <Link href="/pricing" className="block mt-8">
              <Button size="lg" className="w-full">
                Start Free Trial
              </Button>
            </Link>
            <p className="mt-4 text-xs text-center text-muted-foreground">
              7 days free. We'll remind you before we charge.
            </p>
          </Card>
        </div>
      </section>

      {/* Philosophy Teaser */}
      <section className="py-16 border-t bg-muted/30">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight">Why We Do This</h2>
          <p className="mt-4 text-muted-foreground">
            We don't think martial arts is a zero-sum game. When more people
            train, when more gyms succeed, when the sport grows — everyone wins.
            More training partners, better competition, stronger community.
          </p>
          <p className="mt-4 text-muted-foreground">
            That's why we share what we know. Not just with subscribers, but
            with the whole community. Let's grow together.
          </p>
          <div className="mt-8">
            <Link href="/about">
              <Button variant="outline">
                Read Our Full Story
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight">Ready to start?</h2>
          <p className="mt-4 text-muted-foreground">
            Check out our courses and see if this is right for you.
            No pressure, no hard sell.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/courses">
              <Button size="lg">
                Browse Courses
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/business">
              <Button size="lg" variant="outline">
                Business Academy
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
