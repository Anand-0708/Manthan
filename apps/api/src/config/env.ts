import { z } from "zod";

/**
 * Environment schema.
 *
 * Variables are added phase-by-phase as each feature needs them — Phase 1
 * adds database, JWT, cookie, Google OAuth, and account-lockout config.
 * Variables for later phases (S3, SMTP) will be added when those
 * integrations are implemented, so a missing unrelated var never blocks
 * an earlier phase from booting.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  API_VERSION: z.string().default("v1"),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]).default("info"),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
  APP_VERSION: z.string().default("0.1.0"),

  // --- Database ---
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  // --- Auth: JWT ---
  JWT_ACCESS_SECRET: z.string().min(32, "JWT_ACCESS_SECRET must be at least 32 characters"),
  JWT_REFRESH_SECRET: z.string().min(32, "JWT_REFRESH_SECRET must be at least 32 characters"),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),

  // --- Auth: Cookies ---
  // __Host- prefix requires Secure + no Domain attribute + Path=/, which in
  // turn requires HTTPS. Disabled in local dev (plain HTTP), enabled in
  // staging/production.
  COOKIE_SECURE: z.coerce.boolean().default(false),

  // --- CSRF ---
  CSRF_SECRET: z.string().min(32, "CSRF_SECRET must be at least 32 characters"),

  // --- Auth: Google OAuth ---
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_CALLBACK_URL: z.string().default("http://localhost:4000/api/v1/auth/google/callback"),

  // --- Auth: Account lockout ---
  MAX_FAILED_LOGIN_ATTEMPTS: z.coerce.number().int().positive().default(5),
  ACCOUNT_LOCKOUT_MINUTES: z.coerce.number().int().positive().default(15),

  // --- Frontend URL (post-OAuth redirect target) ---
  WEB_URL: z.string().default("http://localhost:3000"),
});

export type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    // eslint-disable-next-line no-console
    console.error("❌ Invalid environment variables:");
    // eslint-disable-next-line no-console
    console.error(JSON.stringify(parsed.error.flatten().fieldErrors, null, 2));
    process.exit(1);
  }

  return parsed.data;
}

export const env = loadEnv();