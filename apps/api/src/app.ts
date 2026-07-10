import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import pinoHttp from "pino-http";
import { env } from "./config/env";
import { errorHandlerMiddleware, notFoundMiddleware } from "./common/middleware/errorHandler.middleware";
import { requestIdMiddleware } from "./common/middleware/requestId.middleware";
import { logger } from "./common/utils/logger";
import routes from "./routes";

/**
 * Builds and returns the Express application.
 *
 * Kept separate from server.ts (which actually binds a port) so the app
 * can be imported directly in tests via supertest without opening a real
 * network socket.
 *
 * Middleware order matters:
 * 1. requestId       — every subsequent log line needs req.requestId/req.log
 * 2. pino-http        — HTTP access logging, uses req.log set by requestId mw
 * 3. helmet           — security headers
 * 4. cors             — cross-origin rules
 * 5. compression      — gzip responses
 * 6. body parsers     — JSON/urlencoded, with size limits
 * 7. cookie-parser    — reads cookies (needed once auth lands)
 * 8. routes
 * 9. notFound         — catches unmatched routes
 * 10. errorHandler    — must be last
 */
export function createApp(): Express {
  const app = express();

  app.disable("x-powered-by");

  app.use(requestIdMiddleware);

  app.use(
    pinoHttp({
      logger,
      genReqId: (req) => (req as express.Request).requestId,
      customLogLevel: (_req, res, err) => {
        if (err || res.statusCode >= 500) return "error";
        if (res.statusCode >= 400) return "warn";
        return "info";
      },
    })
  );

  app.use(helmet());

  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
    })
  );

  app.use(compression());

  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "100kb" }));

  app.use(cookieParser());

  app.use(`/api/${env.API_VERSION}`, routes);

  app.use(notFoundMiddleware);
  app.use(errorHandlerMiddleware);

  return app;
}