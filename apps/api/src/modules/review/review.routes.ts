import { Router } from "express";

import { requireAuth } from "../../common/middleware/auth.middleware";
import { validate } from "../../common/middleware/validate.middleware";
import { asyncHandler } from "../../common/middleware/asyncHandler.middleware";

import { reviewController } from "./review.controller";
import { createReviewSchema } from "./review.validators";

const router = Router();

/**
 * @openapi
 * /reviews:
 *   post:
 *     tags:
 *       - Review
 *     summary: Submit a review for an assigned paper
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Review submitted successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Reviewer not assigned
 *       404:
 *         description: Paper not found
 */
router.post(
  "/",
  requireAuth,
  validate(createReviewSchema),
  asyncHandler(reviewController.create)
);

/**
 * @openapi
 * /reviews:
 *   get:
 *     tags:
 *       - Review
 *     summary: Search, filter and paginate reviews
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reviews retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/",
  requireAuth,
  asyncHandler(reviewController.list)
);

/**
 * @openapi
 * /reviews/paper/{paperId}:
 *   get:
 *     tags:
 *       - Review
 *     summary: Get all reviews of a paper
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: paperId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reviews retrieved successfully
 *       404:
 *         description: Paper not found
 */
router.get(
  "/paper/:paperId",
  requireAuth,
  asyncHandler(reviewController.getByPaper)
);

/**
 * @openapi
 * /reviews/me:
 *   get:
 *     tags:
 *       - Review
 *     summary: Get logged-in reviewer's submitted reviews
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Review list retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/me",
  requireAuth,
  asyncHandler(reviewController.myReviews)
);

export default router;