import { randomUUID } from "node:crypto";
import ms from "ms";
import { env } from "../../config/env";
import { AppError } from "../../common/utils/apiResponse";
import { hashPassword, verifyPassword } from "../../common/utils/password";
import { generateRefreshToken, signAccessToken } from "../../common/utils/jwt";
import { sha256 } from "../../common/utils/tokenHash";
import { authRepository } from "./auth.repository";
import { toSafeUser, type GoogleProfileInput, type SafeUser } from "./auth.types";
import type { LoginInput, RegisterInput } from "./auth.validators";
import { emailService } from "../email/email.service";

export interface AuthResult {
  user: SafeUser;
  accessToken: string;
  refreshToken: string;
}

function refreshTokenExpiresAt(): Date {
  return new Date(Date.now() + ms(env.JWT_REFRESH_EXPIRES_IN));
}

/**
 * Issues a fresh access token + a brand new refresh token family.
 * Called on register, login, and Google OAuth (Section 3).
 */
async function issueTokens(userId: string): Promise<{ accessToken: string; refreshToken: string }> {
  const accessToken = signAccessToken(userId);
  const refreshToken = generateRefreshToken();
  const familyId = randomUUID();

  await authRepository.createRefreshToken({
    userId,
    tokenHash: sha256(refreshToken),
    familyId,
    expiresAt: refreshTokenExpiresAt(),
  });

  return { accessToken, refreshToken };
}

export const authService = {
  async register(input: RegisterInput): Promise<AuthResult> {
    const existing = await authRepository.findUserByEmail(input.email);
    if (existing) {
      throw new AppError(
        409,
        "EMAIL_ALREADY_REGISTERED",
        "An account with this email already exists."
      );
    }

const passwordHash = await hashPassword(input.password);

const user = await authRepository.createUser({
  email: input.email,
  passwordHash,
  name: input.name,
  affiliation: input.affiliation,
});

// Send Welcome Email
await emailService.sendWelcomeEmail(
  user.email,
  user.name
);

const tokens = await issueTokens(user.id);

return {
  user: toSafeUser(user),
  ...tokens,
};
},

  async login(input: LoginInput): Promise<AuthResult> {
    const user = await authRepository.findUserByEmail(input.email);

    // Same generic error for "no such user" and "wrong password" — never
    // reveal which one it was (account enumeration protection).
    const invalidCredentialsError = new AppError(
      401,
      "INVALID_CREDENTIALS",
      "Invalid email or password."
    );

    if (!user) {
      await authRepository.createAuditLog({
        actorId: null,
        action: "LOGIN_FAILURE",
        metadata: { email: input.email, reason: "user_not_found" },
      });
      throw invalidCredentialsError;
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new AppError(
        423,
        "ACCOUNT_LOCKED",
        `Too many failed login attempts. Try again after ${user.lockedUntil.toISOString()}.`
      );
    }

    // OAuth-only accounts have no password hash — same generic error,
    // don't reveal the account exists or how it was created.
    if (!user.passwordHash) {
      await authRepository.createAuditLog({
        actorId: user.id,
        action: "LOGIN_FAILURE",
        metadata: { reason: "oauth_only_account" },
      });
      throw invalidCredentialsError;
    }

    const passwordValid = await verifyPassword(user.passwordHash, input.password);

    if (!passwordValid) {
      const nextAttempts = user.failedLoginAttempts + 1;

      if (nextAttempts >= env.MAX_FAILED_LOGIN_ATTEMPTS) {
        const lockedUntil = new Date(Date.now() + env.ACCOUNT_LOCKOUT_MINUTES * 60_000);
        await authRepository.recordFailedLogin(user.id, nextAttempts, lockedUntil);
        await authRepository.createAuditLog({
          actorId: user.id,
          action: "ACCOUNT_LOCKED",
          metadata: { failedAttempts: nextAttempts, lockedUntil: lockedUntil.toISOString() },
        });
      } else {
        await authRepository.recordFailedLogin(user.id, nextAttempts, null);
        await authRepository.createAuditLog({
          actorId: user.id,
          action: "LOGIN_FAILURE",
          metadata: { failedAttempts: nextAttempts },
        });
      }

      throw invalidCredentialsError;
    }

    await authRepository.resetLoginAttempts(user.id);
    await authRepository.createAuditLog({ actorId: user.id, action: "LOGIN_SUCCESS" });

    const tokens = await issueTokens(user.id);
    return { user: toSafeUser(user), ...tokens };
  },

  /**
   * Rotates a refresh token: validates it, revokes it, issues a new
   * access token + new refresh token in the same family.
   *
   * Reuse detection: if the presented token's hash matches a row that is
   * already marked `revoked`, it means this exact token was already used
   * once before (rotation already happened) — someone is replaying an
   * old token, which only happens if it was stolen. The entire family is
   * revoked immediately, forcing a fresh login on every device sharing
   * that family.
   */
  async refresh(rawRefreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const tokenHash = sha256(rawRefreshToken);
    const stored = await authRepository.findRefreshTokenByHash(tokenHash);

    const invalidTokenError = new AppError(
      401,
      "INVALID_REFRESH_TOKEN",
      "Session expired. Please log in again."
    );

    if (!stored) {
      throw invalidTokenError;
    }

    if (stored.revoked) {
      await authRepository.revokeTokenFamily(stored.familyId);
      await authRepository.createAuditLog({
        actorId: stored.userId,
        action: "REFRESH_TOKEN_REUSE_DETECTED",
        metadata: { familyId: stored.familyId },
      });
      throw invalidTokenError;
    }

    if (stored.expiresAt < new Date()) {
      throw invalidTokenError;
    }

    await authRepository.revokeRefreshTokenById(stored.id);

    const newRefreshToken = generateRefreshToken();
    await authRepository.createRefreshToken({
      userId: stored.userId,
      tokenHash: sha256(newRefreshToken),
      familyId: stored.familyId,
      expiresAt: refreshTokenExpiresAt(),
    });

    const accessToken = signAccessToken(stored.userId);
    return { accessToken, refreshToken: newRefreshToken };
  },

  /**
   * Revokes just the presented refresh token (not the whole family) —
   * a normal logout is not a security incident, just this one session
   * ending. Idempotent: a missing/already-invalid token is not an error.
   */
  async logout(rawRefreshToken: string | undefined): Promise<void> {
    if (!rawRefreshToken) return;

    const stored = await authRepository.findRefreshTokenByHash(sha256(rawRefreshToken));
    if (!stored || stored.revoked) return;

    await authRepository.revokeRefreshTokenById(stored.id);
  },

  async getCurrentUser(userId: string): Promise<SafeUser> {
    const user = await authRepository.findUserById(userId);
    if (!user) {
      throw new AppError(404, "USER_NOT_FOUND", "User not found.");
    }
    return toSafeUser(user);
  },

  /**
   * Handles the three possible outcomes of a Google OAuth callback:
   * 1. This Google account has signed in before -> log them in.
   * 2. No Google link yet, but the email matches an existing
   *    email+password account -> link the accounts (audit OAUTH_LINKED)
   *    so the person can use either method going forward.
   * 3. Brand new person -> create an OAuth-only account (no password).
   */
  async loginWithGoogle(profile: GoogleProfileInput): Promise<AuthResult> {
    let user = await authRepository.findUserByGoogleId(profile.googleId);

    if (!user) {
      const existingByEmail = await authRepository.findUserByEmail(profile.email);

      if (existingByEmail) {
        user = await authRepository.linkGoogleAccount(existingByEmail.id, profile.googleId);
        await authRepository.createAuditLog({ actorId: user.id, action: "OAUTH_LINKED" });
      } else {
        user = await authRepository.createOAuthUser({
          email: profile.email,
          googleId: profile.googleId,
          name: profile.name,
        });
      }
    }

    await authRepository.createAuditLog({
      actorId: user.id,
      action: "LOGIN_SUCCESS",
      metadata: { method: "google" },
    });

    const tokens = await issueTokens(user.id);
    return { user: toSafeUser(user), ...tokens };
  },
};