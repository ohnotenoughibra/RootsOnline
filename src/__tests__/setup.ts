import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock Prisma client
vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      upsert: vi.fn(),
    },
    lessonProgress: {
      findMany: vi.fn(),
      upsert: vi.fn(),
    },
    course: {
      findUnique: vi.fn(),
    },
  },
}));

// Mock Clerk auth
vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(() => ({ userId: null })),
  currentUser: vi.fn(() => null),
}));

// Mock email sending
vi.mock("@/lib/email", () => ({
  sendEmail: vi.fn(() => Promise.resolve()),
  welcomeEmail: vi.fn(() => ({ subject: "Welcome", html: "<p>Welcome</p>" })),
  subscriptionConfirmedEmail: vi.fn(() => ({ subject: "Confirmed", html: "<p>Confirmed</p>" })),
  subscriptionCancelledEmail: vi.fn(() => ({ subject: "Cancelled", html: "<p>Cancelled</p>" })),
  paymentFailedEmail: vi.fn(() => ({ subject: "Failed", html: "<p>Failed</p>" })),
  paymentRetryEmail: vi.fn(() => ({ subject: "Retry", html: "<p>Retry</p>" })),
}));

// Mock Stripe
vi.mock("@/lib/stripe", () => ({
  stripe: {
    webhooks: {
      constructEvent: vi.fn(),
    },
  },
  SUBSCRIPTION_PLANS: {
    monthly: { priceId: "price_monthly", price: 1999 },
    annual: { priceId: "price_annual", price: 19900 },
  },
}));

// Reset mocks between tests
beforeEach(() => {
  vi.clearAllMocks();
});
