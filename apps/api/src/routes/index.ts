import { Router } from "express";
import healthRoutes from "./health.routes";

import authRoutes from "../modules/auth/auth.routes";
import conferenceRoutes from "../modules/conference/conference.routes";
import trackRoutes from "../modules/track/track.routes";

const router = Router();

router.use(healthRoutes);

router.use("/auth", authRoutes);
router.use("/conferences", conferenceRoutes);
router.use("/tracks", trackRoutes);

export default router;