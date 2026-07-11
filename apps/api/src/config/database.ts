import { PrismaClient } from "@prisma/client";
import { env } from "./env";

/**
 * A single shared Prisma Client instance for the whole app.
 *
 * In development, `tsx watch` re-executes this module on every file change.
 * Without caching the instance globally, each reload would open a new
 * connection pool against Postgres and eventually exhaust it. Caching on
 * `globalThis` (dev only) avoids that; production always gets a fresh
 * singleton per process.
 */
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export const prisma =
  global.__prisma ??
  new PrismaClient({
    log: env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (env.NODE_ENV === "development") {
  global.__prisma = prisma;
}

/**
 * Lightweight connectivity check used by the health endpoint.
 * Returns true if a trivial query succeeds, false otherwise — never throws.
 */
export async function isDatabaseConnected(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}