import rateLimit from "express-rate-limit";

/**
 * Global limiter:
 * Protects the whole API from abuse and accidental traffic spikes.
 */
export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: "TOO_MANY_REQUESTS",
      message: "Too many requests. Please try again later.",
    },
  },
});

/**
 * Auth limiter:
 * Extra protection for sensitive endpoints such as login/register/refresh.
 * Works together with account lockout protection.
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: "AUTH_RATE_LIMIT_EXCEEDED",
      message:
        "Too many authentication attempts. Please try again after 15 minutes.",
    },
  },
});