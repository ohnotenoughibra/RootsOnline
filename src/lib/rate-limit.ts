import { headers } from "next/headers";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Check if Upstash Redis is configured
const isUpstashConfigured = !!(
  process.env.UPSTASH_REDIS_REST_URL &&
  process.env.UPSTASH_REDIS_REST_TOKEN
);

// Create Redis client if configured
const redis = isUpstashConfigured
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

// In-memory fallback for development only
const inMemoryStore = new Map<string, { count: number; resetTime: number }>();

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

// Create Upstash rate limiters for different tiers
const rateLimiters = redis ? {
  strict: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "60 s"),
    analytics: true,
    prefix: "ratelimit:strict",
  }),
  standard: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(60, "60 s"),
    analytics: true,
    prefix: "ratelimit:standard",
  }),
  relaxed: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(120, "60 s"),
    analytics: true,
    prefix: "ratelimit:relaxed",
  }),
  webhook: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, "60 s"),
    analytics: true,
    prefix: "ratelimit:webhook",
  }),
} : null;

// Fallback in-memory rate limiter for development
async function inMemoryRateLimit(
  identifier: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const now = Date.now();
  const key = identifier;

  // Clean up expired entries periodically (1% chance per request)
  if (Math.random() < 0.01) {
    for (const [k, v] of inMemoryStore.entries()) {
      if (v.resetTime < now) {
        inMemoryStore.delete(k);
      }
    }
  }

  const record = inMemoryStore.get(key);

  if (!record || record.resetTime < now) {
    inMemoryStore.set(key, {
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

export async function rateLimit(
  identifier: string,
  config: RateLimitConfig = { limit: 60, windowMs: 60000 }
): Promise<RateLimitResult> {
  // Use Upstash in production, fallback to in-memory for development
  if (rateLimiters) {
    // Determine which limiter to use based on config
    let limiter = rateLimiters.standard;
    if (config.limit <= 10) {
      limiter = rateLimiters.strict;
    } else if (config.limit >= 120) {
      limiter = rateLimiters.relaxed;
    }

    const result = await limiter.limit(identifier);
    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
    };
  }

  // Fallback for development (warn in production)
  if (process.env.NODE_ENV === "production") {
    console.warn(
      "Rate limiting using in-memory store in production. " +
      "Configure UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN for distributed rate limiting."
    );
  }

  return inMemoryRateLimit(identifier, config);
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
  // Strict: sensitive endpoints like auth, checkout, promo validation
  strict: { limit: 10, windowMs: 60000 },     // 10 req/min

  // Standard: most API endpoints
  standard: { limit: 60, windowMs: 60000 },   // 60 req/min

  // Relaxed: high-traffic read endpoints
  relaxed: { limit: 120, windowMs: 60000 },   // 120 req/min

  // Webhook: for Stripe webhooks
  webhook: { limit: 100, windowMs: 60000 },   // 100 req/min
} as const;

// Helper to check if rate limiting is properly configured for production
export function isRateLimitConfigured(): boolean {
  return isUpstashConfigured;
}
