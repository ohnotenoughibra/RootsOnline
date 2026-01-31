import Link from "next/link";
import {
  ArrowRight,
  Play,
  Users,
  Trophy,
  Zap,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const disciplines = [
  {
    name: "MMA",
    slug: "MMA",
    description: "Complete mixed martial arts training from striking to grappling",
    color: "bg-red-500",
  },
  {
    name: "Kickboxing",
    slug: "KICKBOXING",
    description: "Master devastating strikes and footwork techniques",
    color: "bg-orange-500",
  },
  {
    name: "Grappling",
    slug: "GRAPPLING",
    description: "Learn submissions, sweeps, and ground control",
    color: "bg-blue-500",
  },
];

const features = [
  {
    icon: Trophy,
    title: "World-Class Coaches",
    description:
      "Learn from champions and elite instructors with decades of experience",
  },
  {
    icon: Play,
    title: "HD Video Lessons",
    description:
      "Crystal clear instructional videos with multiple angles and slow motion",
  },
  {
    icon: Users,
    title: "Community Support",
    description:
      "Join a community of dedicated martial artists from around the world",
  },
  {
    icon: Zap,
    title: "Train Anywhere",
    description:
      "Access lessons on any device, anytime - at home or on the go",
  },
];

const testimonials = [
  {
    name: "Marcus Chen",
    role: "Amateur MMA Fighter",
    content:
      "ROA transformed my game. The attention to detail in each lesson is incredible. I've improved more in 6 months than in 2 years at my local gym.",
  },
  {
    name: "Sarah Williams",
    role: "Kickboxing Enthusiast",
    content:
      "The kickboxing curriculum is perfectly structured. I love being able to replay techniques at my own pace until I get them right.",
  },
  {
    name: "James Rodriguez",
    role: "BJJ Purple Belt",
    content:
      "The grappling content is next level. Having access to multiple world champions' techniques in one place is invaluable.",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black py-20 lg:py-32">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='white'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`
        }} />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            <div className="text-center lg:text-left">
              <Badge className="mb-4" variant="secondary">
                New Courses Added Weekly
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Master Martial Arts
                <span className="block text-primary">From Elite Coaches</span>
              </h1>
              <p className="mt-6 text-lg text-gray-300 max-w-xl mx-auto lg:mx-0">
                World-class instruction in MMA, Kickboxing, and Grappling.
                Train with champions from anywhere in the world with our
                comprehensive video courses.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/sign-up">
                  <Button size="xl" className="w-full sm:w-auto">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/courses">
                  <Button
                    size="xl"
                    variant="outline"
                    className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10"
                  >
                    Browse Courses
                  </Button>
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-8 justify-center lg:justify-start text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>7-day free trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>

            {/* Hero video placeholder */}
            <div className="relative">
              <div className="aspect-video rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 overflow-hidden border border-white/10 shadow-2xl">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/90 shadow-lg cursor-pointer hover:scale-105 transition-transform">
                    <Play className="h-8 w-8 text-primary ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="rounded-lg bg-black/60 backdrop-blur p-4">
                    <p className="text-white font-medium">
                      Watch: Introduction to ROA
                    </p>
                    <p className="text-gray-300 text-sm">
                      See what makes our academy different
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Disciplines Section */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Choose Your Discipline
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Whether you want to compete or just get in shape, we have the
              perfect curriculum for you
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {disciplines.map((discipline) => (
              <Link
                key={discipline.name}
                href={`/courses?discipline=${discipline.slug}`}
              >
                <Card className="group overflow-hidden h-full hover:shadow-lg transition-all hover:-translate-y-1">
                  <div
                    className={`h-48 ${discipline.color} relative overflow-hidden`}
                  >
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl font-bold text-white/20">
                        {discipline.name}
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                      {discipline.name}
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      {discipline.description}
                    </p>
                    <div className="mt-4 flex items-center text-primary font-medium">
                      <span>Explore courses</span>
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Why Train With ROA?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to take your martial arts journey to the next
              level
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title} className="text-center p-6">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview Section */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Start Training for €5/week
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Full access to all courses. Cancel anytime - no commitment.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            {/* Weekly Plan */}
            <Card className="p-8">
              <div className="text-center">
                <h3 className="text-lg font-semibold">Weekly</h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold">€5</span>
                  <span className="text-muted-foreground">/week</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Full access, cancel anytime
                </p>
              </div>
              <ul className="mt-8 space-y-3">
                {[
                  "Unlimited course access",
                  "New content weekly",
                  "HD video quality",
                  "Training footage feedback",
                  "Cancel anytime",
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/pricing" className="block mt-8">
                <Button className="w-full" variant="outline">
                  Start Weekly
                </Button>
              </Link>
            </Card>

            {/* Annual Plan */}
            <Card className="p-8 border-primary relative">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                Save 60%+
              </Badge>
              <div className="text-center">
                <h3 className="text-lg font-semibold">Annual</h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold">€99</span>
                  <span className="text-muted-foreground">/year</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Only €1.90/week - save €161
                </p>
              </div>
              <ul className="mt-8 space-y-3">
                {[
                  "Everything in Weekly",
                  "Save over 60%",
                  "Priority coach feedback",
                  "Early access to new courses",
                  "Course certificates",
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/pricing" className="block mt-8">
                <Button className="w-full">Get Annual - Save 60%</Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              What Our Students Say
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of martial artists who have transformed their
              training with ROA
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center font-semibold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground">{testimonial.content}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to Start Training?
          </h2>
          <p className="mt-4 text-lg opacity-90 max-w-2xl mx-auto">
            Join thousands of martial artists already training with ROA. Start
            your 7-day free trial today.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up">
              <Button
                size="xl"
                variant="secondary"
                className="w-full sm:w-auto"
              >
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
