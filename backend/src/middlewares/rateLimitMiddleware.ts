import { Context, Next } from "hono";
import { Env, Variables, RateLimitConfig, RateLimitEntry } from "../types";

const rateLimitStore = new Map<string, RateLimitEntry>();

export function rateLimit(config: RateLimitConfig) {
  const {
    windowMs,
    maxRequests,
    keyGenerator = (c) => getClientIP(c),
    skipSuccessfulRequests = false,
    skipFailedRequests = false,
  } = config;

  return async (
    c: Context<{ Bindings: Env; Variables: Variables }>,
    next: Next
  ) => {
    const key = keyGenerator(c);
    const now = Date.now();
    const windowStart = now - windowMs;

    cleanupExpiredEntries(windowStart);

    let entry = rateLimitStore.get(key);
    if (!entry || entry.resetTime <= now) {
      entry = {
        count: 0,
        resetTime: now + windowMs,
      };
    }

    if (entry.count >= maxRequests) {
      const resetTimeSeconds = Math.ceil((entry.resetTime - now) / 1000);

      return c.json(
        {
          message: "Too many requests",
          retryAfter: resetTimeSeconds,
        },
        429,
        {
          "Retry-After": resetTimeSeconds.toString(),
          "X-RateLimit-Limit": maxRequests.toString(),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": entry.resetTime.toString(),
        }
      );
    }

    entry.count++;
    rateLimitStore.set(key, entry);

    // Add rate limit headers
    const remaining = Math.max(0, maxRequests - entry.count);
    c.res.headers.set("X-RateLimit-Limit", maxRequests.toString());
    c.res.headers.set("X-RateLimit-Remaining", remaining.toString());
    c.res.headers.set("X-RateLimit-Reset", entry.resetTime.toString());

    // Execute the request
    await next();

    // Optionally adjust count based on response status
    const status = c.res.status;
    if (
      (skipSuccessfulRequests && status < 400) ||
      (skipFailedRequests && status >= 400)
    ) {
      entry.count = Math.max(0, entry.count - 1);
      rateLimitStore.set(key, entry);
    }
  };
}

function getClientIP(c: Context): string {
  const headers = [
    "cf-connecting-ip",
    "x-forwarded-for",
    "x-real-ip",
    "x-client-ip",
    "x-cluster-client-ip",
  ];

  for (const header of headers) {
    const ip = c.req.header(header);
    if (ip) {
      // Take the first IP if there's a comma-separated list
      return ip.split(",")[0].trim();
    }
  }

  // Fallback to a default if no IP found
  return "unknown";
}

function cleanupExpiredEntries(windowStart: number) {
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime <= windowStart) {
      rateLimitStore.delete(key);
    }
  }
}

// Predefined rate limit configurations
export const rateLimits = {
  // Strict rate limiting for authentication endpoints
  auth: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 requests per 15 minutes
  }),

  // Moderate rate limiting for blog creation/updates
  blogWrite: rateLimit({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10, // 10 requests per minute
  }),

  // Lenient rate limiting for read operations
  general: rateLimit({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100, // 100 requests per minute
  }),

  // Very lenient for public endpoints
  public: rateLimit({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 200, // 200 requests per minute
  }),
};

// User-based rate limiting (requires authentication)
export function userRateLimit(config: RateLimitConfig) {
  return rateLimit({
    ...config,
    keyGenerator: (c) => {
      const userId = c.get("userId");
      return userId ? `user:${userId}` : `ip:${getClientIP(c)}`;
    },
  });
}
