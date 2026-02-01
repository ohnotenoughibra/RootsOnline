import { describe, it, expect } from "vitest";
import {
  hasRoleBasedAccess,
  hasActiveSubscriptionStatus,
  shouldHaveAccess,
  hasCoachPermissions,
  hasAdminPermissions,
  canUpdateUserRole,
} from "@/lib/subscription-utils";
import type { Role, SubscriptionStatus } from "@prisma/client";

describe("hasRoleBasedAccess", () => {
  it("returns true for ADMIN role", () => {
    expect(hasRoleBasedAccess("ADMIN")).toBe(true);
  });

  it("returns true for COACH role", () => {
    expect(hasRoleBasedAccess("COACH")).toBe(true);
  });

  it("returns false for STUDENT role", () => {
    expect(hasRoleBasedAccess("STUDENT")).toBe(false);
  });
});

describe("hasActiveSubscriptionStatus", () => {
  it("returns true for ACTIVE status", () => {
    expect(hasActiveSubscriptionStatus("ACTIVE")).toBe(true);
  });

  it("returns true for TRIALING status", () => {
    expect(hasActiveSubscriptionStatus("TRIALING")).toBe(true);
  });

  it("returns false for INACTIVE status", () => {
    expect(hasActiveSubscriptionStatus("INACTIVE")).toBe(false);
  });

  it("returns false for CANCELED status", () => {
    expect(hasActiveSubscriptionStatus("CANCELED")).toBe(false);
  });

  it("returns false for PAST_DUE status", () => {
    expect(hasActiveSubscriptionStatus("PAST_DUE")).toBe(false);
  });
});

describe("shouldHaveAccess", () => {
  describe("privileged roles", () => {
    it("grants access to ADMIN regardless of subscription", () => {
      const statuses: SubscriptionStatus[] = ["ACTIVE", "INACTIVE", "CANCELED", "PAST_DUE", "TRIALING"];
      statuses.forEach((status) => {
        expect(shouldHaveAccess("ADMIN", status)).toBe(true);
      });
    });

    it("grants access to COACH regardless of subscription", () => {
      const statuses: SubscriptionStatus[] = ["ACTIVE", "INACTIVE", "CANCELED", "PAST_DUE", "TRIALING"];
      statuses.forEach((status) => {
        expect(shouldHaveAccess("COACH", status)).toBe(true);
      });
    });
  });

  describe("students", () => {
    it("grants access to STUDENT with ACTIVE subscription", () => {
      expect(shouldHaveAccess("STUDENT", "ACTIVE")).toBe(true);
    });

    it("grants access to STUDENT with TRIALING subscription", () => {
      expect(shouldHaveAccess("STUDENT", "TRIALING")).toBe(true);
    });

    it("denies access to STUDENT with INACTIVE subscription", () => {
      expect(shouldHaveAccess("STUDENT", "INACTIVE")).toBe(false);
    });

    it("denies access to STUDENT with CANCELED subscription", () => {
      expect(shouldHaveAccess("STUDENT", "CANCELED")).toBe(false);
    });

    it("denies access to STUDENT with PAST_DUE subscription", () => {
      expect(shouldHaveAccess("STUDENT", "PAST_DUE")).toBe(false);
    });
  });
});

describe("hasCoachPermissions", () => {
  it("returns true for COACH role", () => {
    expect(hasCoachPermissions("COACH")).toBe(true);
  });

  it("returns true for ADMIN role", () => {
    expect(hasCoachPermissions("ADMIN")).toBe(true);
  });

  it("returns false for STUDENT role", () => {
    expect(hasCoachPermissions("STUDENT")).toBe(false);
  });
});

describe("hasAdminPermissions", () => {
  it("returns true only for ADMIN role", () => {
    expect(hasAdminPermissions("ADMIN")).toBe(true);
  });

  it("returns false for COACH role", () => {
    expect(hasAdminPermissions("COACH")).toBe(false);
  });

  it("returns false for STUDENT role", () => {
    expect(hasAdminPermissions("STUDENT")).toBe(false);
  });
});

describe("canUpdateUserRole", () => {
  it("allows ADMIN to update roles", () => {
    expect(canUpdateUserRole("ADMIN")).toBe(true);
  });

  it("denies COACH from updating roles", () => {
    expect(canUpdateUserRole("COACH")).toBe(false);
  });

  it("denies STUDENT from updating roles", () => {
    expect(canUpdateUserRole("STUDENT")).toBe(false);
  });
});
