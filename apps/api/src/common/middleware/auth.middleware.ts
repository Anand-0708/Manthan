import type { NextFunction, Request, Response } from "express";
import { ACCESS_COOKIE_NAME } from "../utils/cookies";
import { verifyAccessToken } from "../utils/jwt";
import { AppError } from "../utils/apiResponse";

export function requireAuth(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  let token = req.cookies?.[ACCESS_COOKIE_NAME];

  // Support Authorization: Bearer <token>
  if (!token && req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

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