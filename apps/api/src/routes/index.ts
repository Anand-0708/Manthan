import { Router } from "express";
import healthRoutes from "./health.routes";

import authRoutes from "../modules/auth/auth.routes";
import conferenceRoutes from "../modules/conference/conference.routes";
import trackRoutes from "../modules/track/track.routes";
import paperRoutes from "../modules/paper/paper.routes";
import reviewRoutes from "../modules/review/review.routes";
import assignmentRoutes from "../modules/assignment/assignment.routes";
import dashboardRoutes from "../modules/dashboard/dashboard.routes";
import emailRoutes from "../modules/email/email.routes";
const router = Router();

router.use(healthRoutes);

router.use("/auth", authRoutes);
router.use("/conferences", conferenceRoutes);
router.use("/tracks", trackRoutes);
router.use("/papers", paperRoutes);
router.use("/reviews", reviewRoutes);
router.use("/assignments", assignmentRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/email", emailRoutes);
export default router;