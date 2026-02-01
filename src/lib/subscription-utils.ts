import type { Role, SubscriptionStatus } from "@prisma/client";

/**
 * Checks if a user has access based on their role
 * Coaches and Admins always have full access
 */
export function hasRoleBasedAccess(role: Role): boolean {
  const privilegedRoles: Role[] = ["COACH", "ADMIN"];
  return privilegedRoles.includes(role);
}

/**
 * Checks if a subscription status grants access
 */
export function hasActiveSubscriptionStatus(status: SubscriptionStatus): boolean {
  const activeStatuses: SubscriptionStatus[] = ["ACTIVE", "TRIALING"];
  return activeStatuses.includes(status);
}

/**
 * Determines if a user should have content access
 * Based on role or subscription status
 */
export function shouldHaveAccess(role: Role, subscriptionStatus: SubscriptionStatus): boolean {
  // Privileged roles always have access
  if (hasRoleBasedAccess(role)) {
    return true;
  }

  // Otherwise check subscription
  return hasActiveSubscriptionStatus(subscriptionStatus);
}

/**
 * Checks if a user has coach permissions
 */
export function hasCoachPermissions(role: Role): boolean {
  const coachRoles: Role[] = ["COACH", "ADMIN"];
  return coachRoles.includes(role);
}

/**
 * Checks if a user has admin permissions
 */
export function hasAdminPermissions(role: Role): boolean {
  return role === "ADMIN";
}

/**
 * Validates if a role update is allowed
 * Only admins can update roles
 */
export function canUpdateUserRole(currentUserRole: Role): boolean {
  return currentUserRole === "ADMIN";
}
