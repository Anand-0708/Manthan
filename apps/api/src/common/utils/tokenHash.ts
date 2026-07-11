import { createHash } from "node:crypto";

/**
 * SHA-256 hash of a token for storage.
 *
 * Used for refresh tokens: only this hash is ever persisted to the
 * database, never the raw token — the same principle as password hashing.
 * A database leak alone can never be used to forge a valid session.
 */
export function sha256(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}