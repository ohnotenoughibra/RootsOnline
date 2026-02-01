import { describe, it, expect } from "vitest";
import {
  mapStripeStatus,
  isFinalPaymentAttempt,
  formatEuroAmount,
  getPlanNameFromPriceId,
  getSubscriptionAmountDisplay,
} from "@/lib/stripe-utils";

describe("mapStripeStatus", () => {
  it("maps 'active' to 'ACTIVE'", () => {
    expect(mapStripeStatus("active")).toBe("ACTIVE");
  });

  it("maps 'canceled' to 'CANCELED'", () => {
    expect(mapStripeStatus("canceled")).toBe("CANCELED");
  });

  it("maps 'past_due' to 'PAST_DUE'", () => {
    expect(mapStripeStatus("past_due")).toBe("PAST_DUE");
  });

  it("maps 'trialing' to 'TRIALING'", () => {
    expect(mapStripeStatus("trialing")).toBe("TRIALING");
  });

  it("maps 'incomplete' to 'INACTIVE'", () => {
    expect(mapStripeStatus("incomplete")).toBe("INACTIVE");
  });

  it("maps 'incomplete_expired' to 'INACTIVE'", () => {
    expect(mapStripeStatus("incomplete_expired")).toBe("INACTIVE");
  });

  it("maps 'unpaid' to 'INACTIVE'", () => {
    expect(mapStripeStatus("unpaid")).toBe("INACTIVE");
  });

  it("maps 'paused' to 'INACTIVE'", () => {
    expect(mapStripeStatus("paused")).toBe("INACTIVE");
  });
});

describe("isFinalPaymentAttempt", () => {
  it("returns false for attempt 1", () => {
    expect(isFinalPaymentAttempt(1)).toBe(false);
  });

  it("returns false for attempt 2", () => {
    expect(isFinalPaymentAttempt(2)).toBe(false);
  });

  it("returns true for attempt 3", () => {
    expect(isFinalPaymentAttempt(3)).toBe(true);
  });

  it("returns true for attempt > 3", () => {
    expect(isFinalPaymentAttempt(4)).toBe(true);
    expect(isFinalPaymentAttempt(5)).toBe(true);
  });
});

describe("formatEuroAmount", () => {
  it("formats cents to euros correctly", () => {
    expect(formatEuroAmount(1999)).toBe("€19.99");
    expect(formatEuroAmount(19900)).toBe("€199.00");
    expect(formatEuroAmount(100)).toBe("€1.00");
    expect(formatEuroAmount(0)).toBe("€0.00");
  });

  it("handles decimal rounding", () => {
    expect(formatEuroAmount(1)).toBe("€0.01");
    expect(formatEuroAmount(50)).toBe("€0.50");
  });
});

describe("getPlanNameFromPriceId", () => {
  const annualPriceId = "price_annual_123";

  it("returns 'Annual' when price ID matches annual", () => {
    expect(getPlanNameFromPriceId("price_annual_123", annualPriceId)).toBe("Annual");
  });

  it("returns 'Monthly' when price ID does not match annual", () => {
    expect(getPlanNameFromPriceId("price_monthly_456", annualPriceId)).toBe("Monthly");
  });

  it("returns 'Monthly' for any other price ID", () => {
    expect(getPlanNameFromPriceId("price_unknown", annualPriceId)).toBe("Monthly");
  });
});

describe("getSubscriptionAmountDisplay", () => {
  const annualPriceId = "price_annual_123";

  it("returns annual amount for annual price ID", () => {
    expect(getSubscriptionAmountDisplay("price_annual_123", annualPriceId)).toBe("€199/year");
  });

  it("returns monthly amount for non-annual price ID", () => {
    expect(getSubscriptionAmountDisplay("price_monthly_456", annualPriceId)).toBe("€19.99/month");
  });
});
