import { Router } from "express";
import healthRoutes from "./health.routes";
import authRoutes from "../modules/auth/auth.routes";

const router = Router();

/**
 * All API routes are versioned under /api/v1.
 *
 * Remaining business module routers (users, conferences, papers, reviews,
 * decisions, notifications, files, audit) will be mounted here in later
 * phases.
 */
router.use(healthRoutes);
router.use("/auth", authRoutes);

export default router;