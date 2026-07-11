import type { NextFunction, Request, Response } from "express";
import { ACCESS_COOKIE_NAME } from "../utils/cookies";
import { verifyAccessToken } from "../utils/jwt";
import { AppError } from "../utils/apiResponse";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      /** Set by requireAuth once the access token cookie has been verified. */
      user?: { id: string };
    }
  }
}

/**
 * Verifies the access token cookie and attaches `req.user`.
 *
 * Stateless by design — this middleware never touches the database.
 * It only checks the JWT signature and expiry. This is why access tokens
 * are kept short-lived (15 min default): a revoked user's access token
 * remains technically "valid" until it naturally expires, but the window
 * is small, and the refresh token (which IS checked against the database
 * on every use) is where real-time revocation happens.
 */
export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const token = req.cookies?.[ACCESS_COOKIE_NAME];

  if (!token) {
    next(new AppError(401, "UNAUTHENTICATED", "Authentication required."));
    return;
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub };
    next();
  } catch {
    next(new AppError(401, "UNAUTHENTICATED", "Invalid or expired session."));
  }
}