import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About Us | ROA",
  description:
    "ROA - a group of friends growing the martial arts community together since 2023.",
  openGraph: {
    title: "About | ROA",
    description:
      "We're a group of friends with a shared passion for martial arts. Our mission is simple: grow together.",
    url: `${siteConfig.url}/about`,
  },
};

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero - Simple and Direct */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Let's grow together.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            That's not just our slogan. It's how we operate.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 border-t">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight">Our Story</h2>
          <div className="mt-6 space-y-4 text-muted-foreground">
            <p>
              We're a group of friends with different backgrounds but a common
              passion: martial arts. In 2023, we turned our dream into reality
              and opened our own studio in Innsbruck, Austria.
            </p>
            <p>
              Instead of just focusing on traditions, we bring a new perspective
              to the martial arts scene. Collaboration with other creatives and
              community is at the heart of our approach.
            </p>
            <p>
              Now we're taking that same energy online. Our goal is to help the
              martial arts community grow — not just our own members, but anyone
              who wants to learn.
            </p>
          </div>
        </div>
      </section>

      {/* Our Philosophy */}
      <section className="py-16 border-t bg-muted/30">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight">Our Philosophy</h2>
          <div className="mt-6 space-y-4 text-muted-foreground">
            <p>
              We don't see martial arts as a zero-sum game where gyms compete
              for a fixed piece of the pie. We see it differently: the more
              people who train, the bigger the pie gets for everyone.
            </p>
            <p>
              When one gym succeeds, when one coach builds something great, when
              one practitioner falls in love with the sport — that's good for all
              of us. More people training means more training partners, more
              competition, more growth.
            </p>
            <p>
              So we share what we know. We help other gym owners figure out
              modern ways to run their businesses. We create content that helps
              the whole community, not just paying subscribers.
            </p>
          </div>
        </div>
      </section>

      {/* What We're Building */}
      <section className="py-16 border-t">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight">What We're Building</h2>
          <div className="mt-6 space-y-6">
            <div>
              <h3 className="font-semibold">Online Training</h3>
              <p className="mt-2 text-muted-foreground">
                Courses and tutorials from our coaches and guest instructors.
                Learn MMA, kickboxing, and grappling on your own time.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Gym Owner Program</h3>
              <p className="mt-2 text-muted-foreground">
                We're developing resources to help gym owners modernize their
                operations — better processes, modern culture, sustainable growth.
                Moving the sport forward means helping those who run it.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Community</h3>
              <p className="mt-2 text-muted-foreground">
                A space for martial artists to connect, share, and grow together.
                Because the best part of this sport has always been the people.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA - Simple */}
      <section className="py-16 border-t">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight">Come train with us</h2>
          <p className="mt-4 text-muted-foreground">
            Whether you're just starting or you've been training for years,
            there's a place for you here.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link href="/courses">
              <Button size="lg">
                Browse Courses
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="mailto:hello@rootscollective.at">
              <Button size="lg" variant="outline">
                Get in Touch
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
