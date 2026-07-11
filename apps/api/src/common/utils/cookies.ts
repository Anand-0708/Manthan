import type { CookieOptions, Response } from "express";
import ms from "ms";
import { env } from "../../config/env";

/**
 * Cookie naming: the `__Host-` prefix is a browser-enforced security
 * mechanism that guarantees a cookie was set with `Secure`, no `Domain`
 * attribute, and `Path=/` — meaningfully reducing domain-override attacks.
 * It REQUIRES HTTPS, though, so it only works when `COOKIE_SECURE=true`
 * (staging/production). In local dev (plain HTTP), we fall back to
 * unprefixed names — the browser would silently refuse to set a
 * `__Host-` cookie over HTTP anyway.
 */
export const ACCESS_COOKIE_NAME = env.COOKIE_SECURE ? "__Host-access_token" : "access_token";
export const REFRESH_COOKIE_NAME = env.COOKIE_SECURE ? "__Host-refresh_token" : "refresh_token";

function baseCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    // Lax (not Strict): api.* and web frontend may live on separate
    // subdomains in production, where Strict can silently fail to send
    // the cookie on legitimate cross-subdomain navigation. Lax still
    // blocks the classic cross-site POST CSRF vector. The CSRF token
    // middleware (Section 4) is the primary defense regardless.
    sameSite: "lax",
    path: "/",
  };
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/**
 * Sets both auth cookies on the response. Called after register, login,
 * and refresh.
 */
export function setAuthCookies(res: Response, tokens: AuthTokens): void {
  res.cookie(ACCESS_COOKIE_NAME, tokens.accessToken, {
    ...baseCookieOptions(),
    maxAge: ms(env.JWT_ACCESS_EXPIRES_IN),
  });

  res.cookie(REFRESH_COOKIE_NAME, tokens.refreshToken, {
    ...baseCookieOptions(),
    maxAge: ms(env.JWT_REFRESH_EXPIRES_IN),
  });
}

/**
 * Clears both auth cookies. Called on logout.
 *
 * Note: clearing the cookie alone is NOT sufficient for logout — the
 * corresponding refresh token must also be revoked server-side (see
 * auth.service.ts `logout`), otherwise a copy of the still-valid token
 * (e.g. stolen via XSS before logout) would keep working.
 */
export function clearAuthCookies(res: Response): void {
  const clearOptions: CookieOptions = { ...baseCookieOptions() };
  res.clearCookie(ACCESS_COOKIE_NAME, clearOptions);
  res.clearCookie(REFRESH_COOKIE_NAME, clearOptions);
}