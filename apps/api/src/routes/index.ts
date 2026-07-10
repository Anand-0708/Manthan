import { Router } from "express";
import healthRoutes from "./health.routes";

const router = Router();

/**
 * All API routes are versioned under /api/v1.
 *
 * Business module routers (auth, users, conferences, papers, reviews,
 * decisions, notifications, files, audit) will be mounted here in later
 * phases. Phase 0 only exposes the health check.
 */
router.use(healthRoutes);

export default router;