// Stripe is disabled for now
// To enable, add STRIPE_SECRET_KEY to your environment variables

export const stripe = null;

export const SUBSCRIPTION_PLANS = {
  monthly: {
    name: "Monthly",
    price: 29,
    priceId: "",
    interval: "month" as const,
    description: "Perfect for trying out the platform",
  },
  yearly: {
    name: "Yearly",
    price: 249,
    priceId: "",
    interval: "year" as const,
    description: "Best value - save over $100/year",
    savings: 99,
  },
} as const;

export type PlanType = keyof typeof SUBSCRIPTION_PLANS;

// Stub functions - will work when Stripe is enabled
export async function createCheckoutSession(_params: {
  customerId?: string;
  priceId: string;
  userId: string;
  successUrl: string;
  cancelUrl: string;
}) {
  throw new Error("Stripe is not configured yet");
}

export async function getOrCreateStripeCustomer(_params: {
  email: string;
  userId: string;
  name?: string;
}) {
  throw new Error("Stripe is not configured yet");
}

export async function createPortalSession(_params: {
  customerId: string;
  returnUrl: string;
}) {
  throw new Error("Stripe is not configured yet");
}

export async function cancelSubscription(_subscriptionId: string) {
  throw new Error("Stripe is not configured yet");
}

export async function reactivateSubscription(_subscriptionId: string) {
  throw new Error("Stripe is not configured yet");
}
