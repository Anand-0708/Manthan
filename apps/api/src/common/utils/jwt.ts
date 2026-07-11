import jwt from "jsonwebtoken";
import { randomBytes } from "node:crypto";
import { env } from "../../config/env";

export interface AccessTokenPayload {
  sub: string; // user id
}

/**
 * Signs a short-lived access token (JWT). Stateless — verified purely by
 * signature + expiry, never checked against the database. This is what
 * makes horizontal API scaling trivial (no shared session store needed).
 */
export function signAccessToken(userId: string): string {
  return jwt.sign({ sub: userId } satisfies AccessTokenPayload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
  });
}

/**
 * Verifies an access token's signature and expiry. Throws if invalid —
 * callers (the auth middleware) are expected to catch and convert to a
 * 401 response.
 */
export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;
}

/**
 * Generates a new opaque refresh token.
 *
 * Deliberately NOT a JWT — refresh tokens are validated against the
 * database (via their SHA-256 hash), not by decoding a signature. This
 * makes immediate revocation possible (a JWT's claims can't be "unsigned"
 * once issued, but a DB row can be marked revoked instantly).
 */
export function generateRefreshToken(): string {
  return randomBytes(64).toString("hex");
}