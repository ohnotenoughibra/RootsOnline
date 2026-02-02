"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Check, Loader2, ArrowRight, Tag, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PromoData {
  valid: boolean;
  code?: string;
  discountDisplay?: string;
  discountAmount?: number;
  discountType?: string;
}

export default function PricingPage() {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState("");
  const [promoData, setPromoData] = useState<PromoData | null>(null);
  const [validatingPromo, setValidatingPromo] = useState(false);

  const validatePromoCode = async () => {
    if (!promoCode.trim()) return;

    setValidatingPromo(true);
    try {
      const res = await fetch("/api/promo/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoCode }),
      });
      const data = await res.json();

      if (res.ok && data.valid) {
        const discountDisplay =
          data.discountType === "PERCENT"
            ? `${data.discountAmount}% off`
            : `€${(data.discountAmount / 100).toFixed(2)} off`;
        setPromoData({ ...data, discountDisplay });
        toast.success(`Promo applied: ${discountDisplay}`);
      } else {
        toast.error(data.error || "Invalid promo code");
        setPromoData(null);
      }
    } catch {
      toast.error("Failed to validate promo code");
    } finally {
      setValidatingPromo(false);
    }
  };

  const clearPromo = () => {
    setPromoCode("");
    setPromoData(null);
  };

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
        body: JSON.stringify({
          plan: planId,
          promoCode: promoData?.code,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to start checkout";
      toast.error(message);
    } finally {
      setLoading(null);
    }
  };

  const calculatePrice = (basePrice: number) => {
    if (promoData?.valid && promoData.discountType === "PERCENT") {
      return basePrice * (1 - (promoData.discountAmount || 0) / 100);
    }
    return basePrice;
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section - Minimal */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Pricing
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Simple, transparent pricing. Start training today.
          </p>
        </div>
      </section>

      {/* Promo Code Section */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-sm px-4 sm:px-6 lg:px-8 py-6">
          {promoData?.valid ? (
            <div className="flex items-center justify-center gap-2 py-2 px-4 border rounded-full text-sm">
              <Tag className="h-4 w-4" />
              <span>
                {promoData.code}: {promoData.discountDisplay}
              </span>
              <button onClick={clearPromo} className="ml-1 hover:text-primary">
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                placeholder="Promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && validatePromoCode()}
                className="text-center"
              />
              <Button
                variant="outline"
                onClick={validatePromoCode}
                disabled={validatingPromo || !promoCode.trim()}
              >
                {validatingPromo ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Plans Section */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Monthly */}
            <div className="border-2 rounded-lg p-8">
              <div className="mb-6">
                <h3 className="text-lg font-semibold">Monthly</h3>
                <p className="text-sm text-muted-foreground mt-1">Flexible, cancel anytime</p>
              </div>

              <div className="mb-6">
                {promoData?.valid ? (
                  <>
                    <span className="text-4xl font-bold">€{calculatePrice(19.99).toFixed(2)}</span>
                    <span className="text-muted-foreground line-through ml-2">€19.99</span>
                  </>
                ) : (
                  <span className="text-4xl font-bold">€19.99</span>
                )}
                <span className="text-muted-foreground">/month</span>
              </div>

              <ul className="space-y-3 mb-8 text-sm">
                {["All courses & tutorials", "Weekly new content", "HD video streaming", "Coach feedback", "Cancel anytime"].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-foreground" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant="outline"
                className="w-full"
                size="lg"
                onClick={() => handleSubscribe("monthly")}
                disabled={loading !== null}
              >
                {loading === "monthly" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>Get started <ArrowRight className="h-4 w-4 ml-2" /></>
                )}
              </Button>
            </div>

            {/* Annual */}
            <div className="border-2 border-foreground rounded-lg p-8 relative">
              <div className="absolute -top-3 left-6 bg-foreground text-background text-xs px-3 py-1 rounded-full font-medium">
                Save 17%
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold">Annual</h3>
                <p className="text-sm text-muted-foreground mt-1">Best value</p>
              </div>

              <div className="mb-6">
                {promoData?.valid ? (
                  <>
                    <span className="text-4xl font-bold">€{calculatePrice(199).toFixed(2)}</span>
                    <span className="text-muted-foreground line-through ml-2">€199</span>
                  </>
                ) : (
                  <span className="text-4xl font-bold">€199</span>
                )}
                <span className="text-muted-foreground">/year</span>
                <p className="text-xs text-muted-foreground mt-1">€16.58/month billed annually</p>
              </div>

              <ul className="space-y-3 mb-8 text-sm">
                {["Everything in Monthly", "Priority coach feedback", "Q&A sessions", "Certificates", "Early access"].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-foreground" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full"
                size="lg"
                onClick={() => handleSubscribe("annual")}
                disabled={loading !== null}
              >
                {loading === "annual" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>Get annual <ArrowRight className="h-4 w-4 ml-2" /></>
                )}
              </Button>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Secure payment via Stripe. Browse free preview lessons before subscribing.
          </p>
        </div>
      </section>

      {/* Teams CTA */}
      <section className="py-12 border-t">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-muted-foreground">
            Training a team or gym?{" "}
            <a
              href="mailto:teams@rootsonline.academy?subject=Team%20Pricing"
              className="text-foreground underline underline-offset-4 hover:text-primary"
            >
              Get bulk pricing
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
