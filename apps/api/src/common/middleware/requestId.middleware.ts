import type { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { createRequestLogger } from "../utils/logger";

const REQUEST_ID_HEADER = "x-request-id";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      requestId: string;
      log: ReturnType<typeof createRequestLogger>;
    }
  }
}

/**
 * Ensures every request has a unique ID:
 * - Reuses an incoming `X-Request-ID` header if the caller already set one
 *   (useful when the frontend or a load balancer generates it upstream).
 * - Otherwise generates a new UUID v4.
 *
 * The ID is:
 * - Echoed back in the response header, so clients can correlate.
 * - Attached to `req.requestId`.
 * - Used to create a request-scoped child logger at `req.log`, so every
 *   log line for this request is automatically tagged and traceable.
 */
export function requestIdMiddleware(req: Request, res: Response, next: NextFunction): void {
  const incomingId = req.header(REQUEST_ID_HEADER);
  const requestId = incomingId && incomingId.length > 0 ? incomingId : uuidv4();

  req.requestId = requestId;
  req.log = createRequestLogger(requestId);

  res.setHeader("X-Request-ID", requestId);

  next();
}