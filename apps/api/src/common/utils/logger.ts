import pino from "pino";
import { env } from "../../config/env";

/**
 * Base application logger.
 *
 * - Production: structured JSON (consumed by the hosting platform's log viewer
 *   or shipped to a log aggregator later).
 * - Development: pretty-printed, colorized, human-readable.
 *
 * Never log secrets, tokens, passwords, or full request/response bodies.
 */
export const logger = pino({
  level: env.LOG_LEVEL,
  base: {
    app: "manthan-api",
    env: env.NODE_ENV,
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  transport:
    env.NODE_ENV === "development"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "HH:MM:ss",
            ignore: "pid,hostname",
          },
        }
      : undefined,
});

/**
 * Creates a child logger scoped to a single request, so every log line
 * emitted while handling that request automatically carries its requestId.
 */
export function createRequestLogger(requestId: string) {
  return logger.child({ requestId });
}