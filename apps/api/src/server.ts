import { createApp } from "./app";
import { env } from "./config/env";
import { logger } from "./common/utils/logger";

const app = createApp();

const server = app.listen(env.PORT, () => {
  logger.info(
    { port: env.PORT, env: env.NODE_ENV, apiVersion: env.API_VERSION },
    `🚀 Manthan API listening on port ${env.PORT} (${env.NODE_ENV})`
  );
});

function shutdown(signal: string): void {
  logger.info({ signal }, "Received shutdown signal, closing server gracefully...");

  server.close((err) => {
    if (err) {
      logger.error({ err }, "Error during server shutdown");
      process.exit(1);
    }

    logger.info("Server closed. Goodbye.");
    process.exit(0);
  });

  // Force-exit if graceful shutdown hangs
  setTimeout(() => {
    logger.error("Forced shutdown after timeout");
    process.exit(1);
  }, 10_000).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

process.on("unhandledRejection", (reason) => {
  logger.error({ reason }, "Unhandled promise rejection");
});

process.on("uncaughtException", (err) => {
  logger.error({ err }, "Uncaught exception");
  process.exit(1);
});