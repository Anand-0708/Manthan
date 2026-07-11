import argon2 from "argon2";

/**
 * Hashes a plaintext password using argon2id (the hybrid variant
 * recommended for general password hashing — resistant to both
 * side-channel and GPU-cracking attacks).
 */
export async function hashPassword(plainPassword: string): Promise<string> {
  return argon2.hash(plainPassword, { type: argon2.argon2id });
}

/**
 * Verifies a plaintext password against a stored argon2 hash.
 * Never throws — returns false on any verification failure (malformed
 * hash, mismatch, etc.) so callers can treat it as a simple boolean check.
 */
export async function verifyPassword(hash: string, plainPassword: string): Promise<boolean> {
  try {
    return await argon2.verify(hash, plainPassword);
  } catch {
    return false;
  }
}