import type { NextFunction, Request, RequestHandler, Response } from "express";

/**
 * Wraps an async Express route handler so a rejected promise (e.g. an
 * AppError thrown from a service) is passed to next() and handled by the
 * centralized error middleware, instead of crashing the process or
 * hanging the request. Express 4 does not do this automatically for
 * async handlers.
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
): RequestHandler {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
}