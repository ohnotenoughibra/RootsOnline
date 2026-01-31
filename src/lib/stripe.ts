import Stripe from "stripe";

// Initialize Stripe only if secret key is available
export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-11-20.acacia",
      typescript: true,
    })
  : null;

export const SUBSCRIPTION_PLANS = {
  weekly: {
    name: "Weekly",
    price: 5,
    currency: "EUR",
    priceId: process.env.STRIPE_WEEKLY_PRICE_ID || "",
    interval: "week" as const,
    description: "Full access, cancel anytime",
    features: [
      "All courses & tutorials",
      "New content weekly",
      "Training footage feedback",
      "Mobile & desktop access",
      "Cancel anytime",
    ],
  },
  annual: {
    name: "Annual",
    price: 99,
    currency: "EUR",
    priceId: process.env.STRIPE_ANNUAL_PRICE_ID || "",
    interval: "year" as const,
    description: "Best value - save over 60%",
    savings: 161,
    features: [
      "Everything in Weekly",
      "Save €161 vs weekly",
      "Priority feedback",
      "Early access to new courses",
      "Exclusive Q&A sessions",
    ],
  },
} as const;

export type PlanType = keyof typeof SUBSCRIPTION_PLANS;

export function isStripeConfigured(): boolean {
  return !!stripe;
}

export async function createCheckoutSession(params: {
  customerId?: string;
  priceId: string;
  userId: string;
  email: string;
  successUrl: string;
  cancelUrl: string;
  isLifetime?: boolean;
}) {
  if (!stripe) throw new Error("Stripe is not configured");

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    customer: params.customerId,
    customer_email: params.customerId ? undefined : params.email,
    payment_method_types: ["card"],
    line_items: [
      {
        price: params.priceId,
        quantity: 1,
      },
    ],
    mode: params.isLifetime ? "payment" : "subscription",
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: {
      userId: params.userId,
    },
    allow_promotion_codes: true,
  };

  const session = await stripe.checkout.sessions.create(sessionParams);
  return session;
}

export async function getOrCreateStripeCustomer(params: {
  email: string;
  userId: string;
  name?: string;
  existingCustomerId?: string | null;
}): Promise<string> {
  if (!stripe) throw new Error("Stripe is not configured");

  // If customer already exists, return their ID
  if (params.existingCustomerId) {
    return params.existingCustomerId;
  }

  // Check if customer exists by email
  const existingCustomers = await stripe.customers.list({
    email: params.email,
    limit: 1,
  });

  if (existingCustomers.data.length > 0) {
    return existingCustomers.data[0].id;
  }

  // Create new customer
  const customer = await stripe.customers.create({
    email: params.email,
    name: params.name,
    metadata: {
      userId: params.userId,
    },
  });

  return customer.id;
}

export async function createPortalSession(params: {
  customerId: string;
  returnUrl: string;
}) {
  if (!stripe) throw new Error("Stripe is not configured");

  const session = await stripe.billingPortal.sessions.create({
    customer: params.customerId,
    return_url: params.returnUrl,
  });

  return session;
}

export async function cancelSubscription(subscriptionId: string) {
  if (!stripe) throw new Error("Stripe is not configured");

  const subscription = await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });

  return subscription;
}

export async function reactivateSubscription(subscriptionId: string) {
  if (!stripe) throw new Error("Stripe is not configured");

  const subscription = await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
  });

  return subscription;
}

export async function getSubscription(subscriptionId: string) {
  if (!stripe) throw new Error("Stripe is not configured");

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  return subscription;
}
