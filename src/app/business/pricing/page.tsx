"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ArrowRight, Calendar, Phone, Mail, Building } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Included",
    price: "Free",
    description: "Included with your ROA subscription",
    features: [
      "Access to Q&A forum",
      "Community discussions",
      "Basic business articles",
      "Browse all questions & answers",
    ],
    cta: "Get Started",
    href: "/pricing",
    popular: false,
  },
  {
    name: "Business Pro",
    price: "€79",
    period: "/month",
    description: "Everything you need to run a successful gym",
    features: [
      "Full Business Academy courses",
      "Templates & SOPs library",
      "Pricing calculators",
      "Contract templates",
      "Marketing playbooks",
      "Monthly group coaching call",
      "Private gym owners community",
      "Priority Q&A responses",
    ],
    cta: "Start Free Trial",
    href: "/pricing?plan=business-pro",
    popular: true,
  },
  {
    name: "1-on-1 Consulting",
    price: "Custom",
    description: "Personalized guidance for your gym",
    features: [
      "Everything in Business Pro",
      "Free 30-min discovery call",
      "Custom strategy sessions",
      "Gym operations review",
      "Marketing audit",
      "Pricing optimization",
      "Direct access via WhatsApp/Slack",
    ],
    cta: "Book Free Call",
    href: "#consultation",
    popular: false,
  },
];

export default function BusinessPricingPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    gymName: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/business/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });

      if (!response.ok) {
        throw new Error("Failed to submit");
      }

      setIsSubmitted(true);
      setFormState({ name: "", email: "", gymName: "", phone: "", message: "" });
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-muted-foreground mb-2">Business Academy</p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Grow Your Gym
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            From free resources to personalized consulting — choose what works for you.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="border-t py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={cn(
                  "rounded-xl border p-6 flex flex-col",
                  plan.popular && "border-foreground border-2"
                )}
              >
                {plan.popular && (
                  <span className="text-xs font-medium px-3 py-1 rounded-full bg-foreground text-background w-fit mb-4">
                    Most Popular
                  </span>
                )}
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className="text-muted-foreground">{plan.period}</span>
                  )}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {plan.description}
                </p>

                <ul className="mt-6 space-y-3 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="mt-6">
                  {plan.href.startsWith("#") ? (
                    <a href={plan.href}>
                      <Button
                        className="w-full"
                        variant={plan.popular ? "default" : "outline"}
                      >
                        {plan.cta}
                      </Button>
                    </a>
                  ) : (
                    <Link href={plan.href}>
                      <Button
                        className="w-full"
                        variant={plan.popular ? "default" : "outline"}
                      >
                        {plan.cta}
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="border-t py-16 bg-muted/30">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8">What You Get with Business Pro</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Complete Course Library</h3>
              <p className="text-muted-foreground">
                In-depth courses on gym operations, marketing, events, community building,
                pricing strategy, and more. New content added monthly.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Templates & Resources</h3>
              <p className="text-muted-foreground">
                Ready-to-use SOPs, contracts, pricing sheets, marketing templates,
                and operational checklists. Just customize and deploy.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Monthly Group Calls</h3>
              <p className="text-muted-foreground">
                Live sessions with experienced gym owners. Bring your questions,
                get real answers, learn from others' experiences.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Private Community</h3>
              <p className="text-muted-foreground">
                Connect with gym owners worldwide. Share wins, troubleshoot problems,
                and build relationships with people who understand your challenges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Consultation Form */}
      <section id="consultation" className="border-t py-16">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold">Book a Free Consultation</h2>
            <p className="mt-2 text-muted-foreground">
              30 minutes to discuss your gym and see how we can help. No obligation.
            </p>
          </div>

          {isSubmitted ? (
            <div className="rounded-xl border p-8 text-center">
              <div className="h-12 w-12 rounded-full bg-foreground/10 flex items-center justify-center mx-auto mb-4">
                <Check className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Request Received</h3>
              <p className="text-muted-foreground">
                We'll be in touch within 24 hours to schedule your call.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    placeholder="John Smith"
                    value={formState.name}
                    onChange={(e) =>
                      setFormState({ ...formState, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@mygym.com"
                    value={formState.email}
                    onChange={(e) =>
                      setFormState({ ...formState, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gymName">Gym Name</Label>
                  <Input
                    id="gymName"
                    placeholder="Iron Fist MMA"
                    value={formState.gymName}
                    onChange={(e) =>
                      setFormState({ ...formState, gymName: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone (optional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 555 123 4567"
                    value={formState.phone}
                    onChange={(e) =>
                      setFormState({ ...formState, phone: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">What would you like to discuss?</Label>
                <Textarea
                  id="message"
                  placeholder="Tell us about your gym and what challenges you're facing..."
                  rows={4}
                  value={formState.message}
                  onChange={(e) =>
                    setFormState({ ...formState, message: e.target.value })
                  }
                  required
                />
              </div>

              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Request Free Consultation"}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                We'll email you within 24 hours to schedule a time that works.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t py-16 bg-muted/30">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8">Common Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Do I need the regular subscription too?</h3>
              <p className="text-muted-foreground text-sm">
                Business Pro is a standalone subscription. You don't need the training subscription
                unless you also want access to martial arts courses.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">What if I'm just starting a gym?</h3>
              <p className="text-muted-foreground text-sm">
                Perfect timing. Business Pro includes startup guides, and consulting can help
                you avoid expensive mistakes. Book a free call to discuss your situation.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">How does the consulting work?</h3>
              <p className="text-muted-foreground text-sm">
                After the free discovery call, we'll propose a plan based on your needs.
                Most gym owners do 2-4 sessions per month, either focused sprints or ongoing support.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Can I cancel anytime?</h3>
              <p className="text-muted-foreground text-sm">
                Yes. Monthly subscriptions can be cancelled anytime. No long-term contracts,
                no cancellation fees.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold">Not sure which is right for you?</h2>
          <p className="mt-2 text-muted-foreground">
            Book a free call and we'll help you figure it out.
          </p>
          <div className="mt-6">
            <a href="#consultation">
              <Button size="lg">
                Book Free Call
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
