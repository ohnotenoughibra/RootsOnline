import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const disciplines = [
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
];

export default function HomePage() {
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
            We're Roots Collective — a group of friends building something for
            the martial arts community. Learn MMA, kickboxing, and grappling
            from coaches who actually care about your progress.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link href="/courses">
              <Button size="xl" className="w-full sm:w-auto">
                Browse Courses
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/about">
              <Button size="xl" variant="outline" className="w-full sm:w-auto">
                Our Story
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Disciplines */}
      <section className="py-16 border-t">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight">What We Teach</h2>
          <div className="mt-8 space-y-4">
            {disciplines.map((discipline) => (
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
              <span className="text-foreground font-medium">Progress tracking</span>{" "}
              — See where you've been and where you're going. Curriculum designed
              to actually build skills, not just fill time.
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
          <div className="mt-8">
            <Link href="/courses">
              <Button size="lg">
                Browse Courses
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
