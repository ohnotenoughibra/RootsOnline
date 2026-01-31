"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { CheckCircle2, Loader2, Zap, Gift, Building2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const plans = [
  {
    id: "weekly",
    name: "Weekly",
    price: 5,
    currency: "€",
    interval: "week",
    description: "Full access, cancel anytime",
    features: [
      "Unlimited access to all courses",
      "New content added weekly",
      "HD video quality",
      "Training footage feedback",
      "Mobile & desktop access",
      "Cancel anytime - no commitment",
    ],
  },
  {
    id: "annual",
    name: "Annual",
    price: 99,
    currency: "€",
    interval: "year",
    description: "Best value - save over 60%",
    popular: true,
    savings: "Save €161",
    features: [
      "Everything in Weekly",
      "Only €1.90/week (save 60%+)",
      "Priority feedback from coaches",
      "Early access to new courses",
      "Exclusive Q&A sessions",
      "Course completion certificates",
    ],
  },
];

export default function PricingPage() {
  const { isSignedIn, user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [showSepaDialog, setShowSepaDialog] = useState(false);

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
          <Badge className="mb-4" variant="secondary">
            <Gift className="h-3 w-3 mr-1" />
            Limited Time: 60%+ off Annual Plan
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Train Like a Champion
          </h1>
          <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
            Get unlimited access to world-class martial arts instruction.
            Start for just €5/week - cancel anytime.
          </p>
        </div>

        {/* Plans */}
        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
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
                  Best Value
                </Badge>
              )}

              <div className="text-center">
                <h3 className="text-xl font-semibold">{plan.name}</h3>
                <div className="mt-4 flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-bold">{plan.currency}{plan.price}</span>
                  <span className="text-muted-foreground">/{plan.interval}</span>
                </div>
                {plan.savings && (
                  <Badge variant="secondary" className="mt-2">
                    {plan.savings}
                  </Badge>
                )}
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
                ) : plan.popular ? (
                  "Get Annual - Save 60%"
                ) : (
                  "Start Weekly"
                )}
              </Button>
            </Card>
          ))}
        </div>

        {/* Comparison */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-8 text-sm text-muted-foreground">
            <span>Weekly: €5 × 52 = <strong className="text-foreground">€260/year</strong></span>
            <span className="text-primary font-semibold">vs</span>
            <span>Annual: <strong className="text-foreground">€99/year</strong> (save €161)</span>
          </div>
        </div>

        {/* SEPA Option */}
        <div className="mt-8 text-center">
          <Button
            variant="ghost"
            className="text-muted-foreground"
            onClick={() => setShowSepaDialog(true)}
          >
            <Building2 className="h-4 w-4 mr-2" />
            Pay via Bank Transfer (SEPA) - No fees
          </Button>
        </div>

        {/* Trust badges */}
        <div className="mt-4 text-center">
          <p className="text-muted-foreground">
            7-day money-back guarantee. Secure payment via Stripe. Cancel anytime.
          </p>
        </div>

        {/* SEPA Dialog */}
        <Dialog open={showSepaDialog} onOpenChange={setShowSepaDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Bank Transfer (SEPA)
              </DialogTitle>
              <DialogDescription>
                Pay for your annual subscription via bank transfer - no processing fees!
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="bg-muted p-4 rounded-lg space-y-2 font-mono text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-bold">€99.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bank:</span>
                  <span>Your Bank Name</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">IBAN:</span>
                  <span>DE89 3704 0044 0532 0130 00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">BIC:</span>
                  <span>COBADEFFXXX</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reference:</span>
                  <span className="text-primary font-bold">
                    ROA-{user?.id?.slice(-8).toUpperCase() || "XXXXXXXX"}
                  </span>
                </div>
              </div>

              <div className="text-sm text-muted-foreground space-y-2">
                <p><strong>Important:</strong></p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Include your reference code in the payment description</li>
                  <li>Activation within 24-48 hours after payment received</li>
                  <li>Annual subscription only (€99/year)</li>
                  <li>Email confirmation sent after activation</li>
                </ul>
              </div>

              <div className="text-sm">
                Questions? Email us at{" "}
                <a href="mailto:support@rootsonline.com" className="text-primary hover:underline">
                  support@rootsonline.com
                </a>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* FAQ */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold">Can I really cancel anytime?</h3>
              <p className="mt-2 text-muted-foreground">
                Absolutely! With the weekly plan, you can cancel any time with no commitment.
                You&apos;ll keep access until your current period ends.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">Why is annual so much cheaper?</h3>
              <p className="mt-2 text-muted-foreground">
                We reward commitment! Annual members save over 60% compared to weekly billing.
                It&apos;s our way of thanking dedicated students.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">What payment methods do you accept?</h3>
              <p className="mt-2 text-muted-foreground">
                We accept all major credit cards, Apple Pay, Google Pay, and SEPA Direct Debit
                through our secure payment processor, Stripe.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">What&apos;s included in training footage feedback?</h3>
              <p className="mt-2 text-muted-foreground">
                Upload videos of your training and get personalized video feedback from
                our expert coaches to improve your technique.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">Can I upgrade from weekly to annual?</h3>
              <p className="mt-2 text-muted-foreground">
                Yes! You can upgrade anytime. We&apos;ll prorate your remaining weekly balance
                towards your annual subscription.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
