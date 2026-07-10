import type { NextFunction, Request, Response } from "express";
import { AppError, sendError } from "../utils/apiResponse";

/**
 * Catches any error passed to `next(err)` (or thrown in an async handler
 * wrapped appropriately) and converts it into the standard
 * `{ error: { code, message } }` response shape.
 *
 * Rules:
 * - Known `AppError`s: use their own status/code/message.
 * - Anything else (unexpected exceptions): respond with a generic 500 and
 *   log the full error server-side — never leak internals to the client.
 *
 * Must be the LAST middleware registered in app.ts.
 */
export function errorHandlerMiddleware(
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    req.log?.warn({ err, code: err.code }, "Handled application error");
    sendError(res, err.statusCode, err.code, err.message, err.details);
    return;
  }

  const error = err instanceof Error ? err : new Error("Unknown error");
  req.log?.error({ err: error }, "Unhandled error");

  sendError(res, 500, "INTERNAL_SERVER_ERROR", "Something went wrong. Please try again.");
}

/**
 * Catches requests to routes that don't exist. Registered right before the
 * error handler, after all real routes.
 */
export function notFoundMiddleware(req: Request, res: Response): void {
  sendError(res, 404, "NOT_FOUND", `Route ${req.method} ${req.originalUrl} not found`);
}