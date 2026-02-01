import Link from "next/link";
import {
  ArrowRight,
  Users,
  MessageCircle,
  BookOpen,
  Award,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const disciplines = [
  {
    name: "MMA",
    slug: "MMA",
    description: "Complete mixed martial arts training",
  },
  {
    name: "Kickboxing",
    slug: "KICKBOXING",
    description: "Master striking and footwork",
  },
  {
    name: "Grappling",
    slug: "GRAPPLING",
    description: "Submissions and ground control",
  },
];

const communityFeatures = [
  {
    icon: Users,
    title: "Train Together",
    description: "Connect with martial artists worldwide who share your passion",
  },
  {
    icon: MessageCircle,
    title: "Coach Feedback",
    description: "Get personalized feedback from professional coaches",
  },
  {
    icon: BookOpen,
    title: "Structured Learning",
    description: "Follow proven curriculums designed by champions",
  },
  {
    icon: Award,
    title: "Track Progress",
    description: "Earn certificates and celebrate your achievements",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section - Minimal */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Learn martial arts
            <span className="block text-muted-foreground">from the best</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Join a community of dedicated martial artists. Train with world-class
            coaches in MMA, Kickboxing, and Grappling.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up">
              <Button size="xl" className="w-full sm:w-auto">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/courses">
              <Button size="xl" variant="outline" className="w-full sm:w-auto">
                Browse Courses
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Disciplines Section - Minimal */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Choose Your Path
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3 max-w-4xl mx-auto">
            {disciplines.map((discipline) => (
              <Link
                key={discipline.name}
                href={`/courses?discipline=${discipline.slug}`}
              >
                <Card className="group h-full hover:bg-muted/50 transition-colors border-2 hover:border-foreground/20">
                  <CardContent className="p-6 text-center">
                    <h3 className="text-lg font-semibold">
                      {discipline.name}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {discipline.description}
                    </p>
                    <div className="mt-4 flex items-center justify-center text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Explore</span>
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              More Than Just Videos
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Join a supportive community that helps you grow
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {communityFeatures.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border-2">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-medium">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simple Pricing */}
      <section className="py-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Simple Pricing
          </h2>
          <p className="mt-4 text-muted-foreground">
            Full access to everything. No hidden fees.
          </p>

          <Card className="mt-8 p-8 border-2">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-5xl font-bold">$19</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              or $199/year (save 17%)
            </p>
            <ul className="mt-8 space-y-3 text-left max-w-xs mx-auto">
              {[
                "Unlimited course access",
                "New content weekly",
                "Coach feedback",
                "Community access",
                "Progress tracking",
                "Cancel anytime",
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-foreground" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Link href="/pricing" className="block mt-8">
              <Button size="lg" className="w-full">
                Start 7-Day Free Trial
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* CTA Section - Minimal */}
      <section className="py-20 border-t">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Ready to begin?
          </h2>
          <p className="mt-4 text-muted-foreground">
            Start your martial arts journey today with a free 7-day trial.
          </p>
          <div className="mt-8">
            <Link href="/sign-up">
              <Button size="xl">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
