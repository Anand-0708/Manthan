import type { NextFunction, Request, Response } from "express";
import { ACCESS_COOKIE_NAME } from "../utils/cookies";
import { verifyAccessToken } from "../utils/jwt";
import { AppError } from "../utils/apiResponse";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    /**
     * Passport already defines Request.user?: User.
     * We only extend the User interface with the fields we actually use.
     */
    interface User {
      id: string;
    }
  }
}

/**
 * Verifies the access token cookie and attaches `req.user`.
 *
 * Stateless by design — this middleware never touches the database.
 * It only checks the JWT signature and expiry.
 */
export function requireAuth(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const token = req.cookies?.[ACCESS_COOKIE_NAME];

  if (!token) {
    next(
      new AppError(
        401,
        "UNAUTHENTICATED",
        "Authentication required."
      )
    );
    return;
  }

  try {
    const payload = verifyAccessToken(token);

    // Passport owns req.user, we only populate it.
    req.user = {
      id: payload.sub,
    };

    next();
  } catch {
    next(
      new AppError(
        401,
        "UNAUTHENTICATED",
        "Invalid or expired session."
      )
    );
  }
}