import { Router } from "express";

import healthRoutes from "./health.routes";
import authRoutes from "../modules/auth/auth.routes";
import usersRoutes from "../modules/users/users.routes";
import conferenceRoutes from "../modules/conference/conference.routes";

const router = Router();

/**
 * All API routes are versioned under /api/v1.
 *
 * Business modules are mounted here as they are implemented.
 */
router.use(healthRoutes);

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/conferences", conferenceRoutes);

export default router;