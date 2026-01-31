"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { CheckCircle2, Loader2, Zap } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const plans = [
  {
    id: "monthly",
    name: "Monthly",
    price: 29,
    interval: "month",
    description: "Full access, cancel anytime",
    features: [
      "Unlimited access to all courses",
      "New content added weekly",
      "HD video quality",
      "Training footage feedback",
      "Mobile & desktop access",
      "Cancel anytime",
    ],
  },
  {
    id: "annual",
    name: "Annual",
    price: 249,
    interval: "year",
    description: "Best value - save $99/year",
    popular: true,
    features: [
      "Everything in Monthly",
      "Save $99 vs monthly",
      "Priority feedback from coaches",
      "Early access to new courses",
      "Exclusive Q&A sessions",
    ],
  },
  {
    id: "lifetime",
    name: "Lifetime",
    price: 499,
    interval: "once",
    description: "Pay once, access forever",
    features: [
      "Everything in Annual",
      "Never pay again",
      "Founding member badge",
      "Direct coach access",
      "Future courses included",
    ],
  },
];

export default function PricingPage() {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (planId: string) => {
    if (!isSignedIn) {
      router.push("/sign-up?redirect_url=/pricing");
      return;
    }

    setLoading(planId);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to start checkout. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Simple, Transparent Pricing
          </h1>
          <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
            Get unlimited access to all courses from world-class martial arts
            coaches. No hidden fees.
          </p>
        </div>

        {/* Plans */}
        <div className="grid gap-8 lg:grid-cols-3 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative p-8 ${
                plan.popular ? "border-primary shadow-lg scale-105" : ""
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Zap className="h-3 w-3 mr-1" />
                  Most Popular
                </Badge>
              )}

              <div className="text-center">
                <h3 className="text-xl font-semibold">{plan.name}</h3>
                <div className="mt-4 flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">/{plan.interval}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {plan.description}
                </p>
              </div>

              <ul className="mt-8 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full mt-8"
                size="lg"
                variant={plan.popular ? "default" : "outline"}
                onClick={() => handleSubscribe(plan.id)}
                disabled={loading !== null}
              >
                {loading === plan.id ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Get ${plan.name}`
                )}
              </Button>
            </Card>
          ))}
        </div>

        {/* Trust badges */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            30-day money-back guarantee. Secure payment via Stripe.
          </p>
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold">Can I cancel anytime?</h3>
              <p className="mt-2 text-muted-foreground">
                Yes! You can cancel your subscription at any time. You&apos;ll
                continue to have access until the end of your billing period.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">What payment methods do you accept?</h3>
              <p className="mt-2 text-muted-foreground">
                We accept all major credit cards (Visa, Mastercard, American
                Express) through our secure payment processor, Stripe.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">What&apos;s included in the training footage feedback?</h3>
              <p className="mt-2 text-muted-foreground">
                Upload videos of your training and get personalized feedback from
                our expert coaches to improve your technique.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">Can I switch plans?</h3>
              <p className="mt-2 text-muted-foreground">
                Yes, you can upgrade or downgrade your plan at any time. Changes
                take effect at the start of your next billing cycle.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
