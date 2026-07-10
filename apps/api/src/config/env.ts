import { z } from "zod";

/**
 * Environment schema.
 *
 * Only variables actually needed by Phase 0 (server bootstrap, health check,
 * logging, CORS) are validated here. Variables for later phases (DB, JWT,
 * S3, SMTP, OAuth) are intentionally NOT added yet — they will be introduced
 * in the phase that implements the feature that needs them, so a missing
 * unrelated var never blocks an earlier phase from booting.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  API_VERSION: z.string().default("v1"),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]).default("info"),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
  APP_VERSION: z.string().default("0.1.0"),
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