import { headers } from "next/headers";

// Simple in-memory rate limiter for development
// In production, use Upstash Redis for distributed rate limiting
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

interface RateLimitConfig {
  limit: number;      // Number of requests allowed
  windowMs: number;   // Time window in milliseconds
}

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

export async function rateLimit(
  identifier: string,
  config: RateLimitConfig = { limit: 60, windowMs: 60000 }
): Promise<RateLimitResult> {
  const now = Date.now();
  const key = identifier;

  // Clean up expired entries periodically
  if (Math.random() < 0.01) {
    for (const [k, v] of rateLimitStore.entries()) {
      if (v.resetTime < now) {
        rateLimitStore.delete(k);
      }
    }
  }

  const record = rateLimitStore.get(key);

  if (!record || record.resetTime < now) {
    // Create new window
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return {
      success: true,
      limit: config.limit,
      remaining: config.limit - 1,
      reset: now + config.windowMs,
    };
  }

  if (record.count >= config.limit) {
    return {
      success: false,
      limit: config.limit,
      remaining: 0,
      reset: record.resetTime,
    };
  }

  record.count += 1;
  return {
    success: true,
    limit: config.limit,
    remaining: config.limit - record.count,
    reset: record.resetTime,
  };
}

export async function getClientIp(): Promise<string> {
  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  const realIp = headersList.get("x-real-ip");

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  if (realIp) {
    return realIp;
  }

  return "127.0.0.1";
}

// Preset configurations for different endpoint types
export const RATE_LIMITS = {
  // Strict: sensitive endpoints like auth, checkout
  strict: { limit: 10, windowMs: 60000 },     // 10 req/min

  // Standard: most API endpoints
  standard: { limit: 60, windowMs: 60000 },   // 60 req/min

  // Relaxed: high-traffic read endpoints
  relaxed: { limit: 120, windowMs: 60000 },   // 120 req/min

  // Webhook: for Stripe webhooks
  webhook: { limit: 100, windowMs: 60000 },   // 100 req/min
} as const;
