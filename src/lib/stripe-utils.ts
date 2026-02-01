import type Stripe from "stripe";
import type { SubscriptionStatus } from "@prisma/client";

/**
 * Maps Stripe subscription status to our internal SubscriptionStatus enum
 */
export function mapStripeStatus(status: Stripe.Subscription.Status): SubscriptionStatus {
  switch (status) {
    case "active":
      return "ACTIVE";
    case "canceled":
      return "CANCELED";
    case "past_due":
      return "PAST_DUE";
    case "trialing":
      return "TRIALING";
    case "incomplete":
    case "incomplete_expired":
    case "unpaid":
    case "paused":
    default:
      return "INACTIVE";
  }
}

/**
 * Determines if this is a final payment attempt (Stripe retries 3 times by default)
 */
export function isFinalPaymentAttempt(attemptCount: number): boolean {
  return attemptCount >= 3;
}

/**
 * Formats an amount in cents to a Euro string
 */
export function formatEuroAmount(amountInCents: number): string {
  return `€${(amountInCents / 100).toFixed(2)}`;
}

/**
 * Determines the plan name from Stripe price ID
 */
export function getPlanNameFromPriceId(
  priceId: string,
  annualPriceId: string
): "Monthly" | "Annual" {
  return priceId === annualPriceId ? "Annual" : "Monthly";
}

/**
 * Calculates subscription amount display string from price ID
 */
export function getSubscriptionAmountDisplay(
  priceId: string,
  annualPriceId: string
): string {
  return priceId === annualPriceId ? "€199/year" : "€19.99/month";
}
