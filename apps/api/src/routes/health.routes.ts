import { Router } from "express";
import { env } from "../config/env";

const router = Router();

/**
 * GET /api/v1/health
 *
 * Basic liveness + component status check, used by uptime monitors and
 * load balancers.
 *
 * `database` and `storage` are reported as "not_configured" in Phase 0
 * since Prisma and S3 have not been wired up yet. They will report
 * "connected" / "error" once those integrations land in later phases.
 */
router.get("/health", (_req, res) => {
  res.status(200).json({
    status: "healthy",
    database: "not_configured",
    storage: "not_configured",
    version: env.APP_VERSION,
    timestamp: new Date().toISOString(),
  });
});

export default router;