import { Router } from "express";

import { requireAuth } from "../../common/middleware/auth.middleware";
import { asyncHandler } from "../../common/middleware/asyncHandler.middleware";

import { dashboardController } from "./dashboard.controller";

const router = Router();

/**
 * @openapi
 * /dashboard/chair:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Get Chair dashboard statistics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Chair dashboard data retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/chair",
  requireAuth,
  asyncHandler(dashboardController.chair)
);

/**
 * @openapi
 * /dashboard/author:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Get Author dashboard statistics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Author dashboard data retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/author",
  requireAuth,
  asyncHandler(dashboardController.author)
);

/**
 * @openapi
 * /dashboard/reviewer:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Get Reviewer dashboard statistics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reviewer dashboard data retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/reviewer",
  requireAuth,
  asyncHandler(dashboardController.reviewer)
);

export default router;