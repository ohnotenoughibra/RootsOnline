"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const plans = [
  {
    name: "Monthly",
    price: 29,
    priceId: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID || "price_monthly",
    interval: "month",
    description: "Perfect for trying out the platform",
    features: [
      "Unlimited access to all courses",
      "New content added weekly",
      "HD video quality",
      "Mobile & tablet access",
      "Cancel anytime",
    ],
  },
  {
    name: "Yearly",
    price: 249,
    priceId: process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID || "price_yearly",
    interval: "year",
    description: "Best value - save over $100/year",
    popular: true,
    features: [
      "Everything in Monthly",
      "2 months free (save $99)",
      "Priority support",
      "Early access to new courses",
      "Exclusive Q&A sessions with coaches",
    ],
  },
];

export default function PricingPage() {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (priceId: string, planType: string) => {
    if (!isSignedIn) {
      router.push("/sign-up");
      return;
    }

    setLoading(priceId);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceId, planType }),
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
            coaches. No hidden fees, cancel anytime.
          </p>
        </div>

        {/* Plans */}
        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative p-8 ${
                plan.popular ? "border-primary shadow-lg scale-105" : ""
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
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
                onClick={() => handleSubscribe(plan.priceId, plan.name.toLowerCase())}
                disabled={loading !== null}
              >
                {loading === plan.priceId ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Get Started"
                )}
              </Button>
            </Card>
          ))}
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
              <h3 className="font-semibold">Is there a free trial?</h3>
              <p className="mt-2 text-muted-foreground">
                New subscribers get a 7-day free trial on both plans. You won&apos;t
                be charged until the trial ends.
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
