import { Router } from "express";
import { paperUpload } from "../../common/middleware/upload.middleware";
import { requireAuth } from "../../common/middleware/auth.middleware";
import { validate } from "../../common/middleware/validate.middleware";
import { asyncHandler } from "../../common/middleware/asyncHandler.middleware";

import { paperController } from "./paper.controller";

import {
  createPaperSchema,
  updatePaperSchema,
  updatePaperStatusSchema,
} from "./paper.validators";

const router = Router();

/**
 * @openapi
 * /papers:
 *   post:
 *     tags:
 *       - Paper
 *     summary: Submit a new paper
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Paper submitted successfully
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  requireAuth,
  validate(createPaperSchema),
  asyncHandler(paperController.create)
);

/**
 * @openapi
 * /papers:
 *   get:
 *     tags:
 *       - Paper
 *     summary: Search, filter and paginate papers
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Paper list retrieved successfully
 */
router.get(
  "/",
  requireAuth,
  asyncHandler(paperController.list)
);

/**
 * @openapi
 * /papers/track/{trackId}:
 *   get:
 *     tags:
 *       - Paper
 *     summary: Get papers by track
 *     parameters:
 *       - in: path
 *         name: trackId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Papers retrieved successfully
 */
router.get(
  "/track/:trackId",
  asyncHandler(paperController.getByTrack)
);

/**
 * @openapi
 * /papers/{id}:
 *   get:
 *     tags:
 *       - Paper
 *     summary: Get paper by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Paper retrieved successfully
 *       404:
 *         description: Paper not found
 */
router.get(
  "/:id",
  asyncHandler(paperController.getById)
);

/**
 * @openapi
 * /papers/{id}:
 *   patch:
 *     tags:
 *       - Paper
 *     summary: Update paper details
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Paper updated successfully
 */
router.patch(
  "/:id",
  requireAuth,
  validate(updatePaperSchema),
  asyncHandler(paperController.update)
);

/**
 * @openapi
 * /papers/{id}/status:
 *   patch:
 *     tags:
 *       - Paper
 *     summary: Update paper status
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Paper status updated successfully
 */
router.patch(
  "/:id/status",
  requireAuth,
  validate(updatePaperStatusSchema),
  asyncHandler(paperController.updateStatus)
);

/**
 * @openapi
 * /papers/{id}/upload:
 *   post:
 *     tags:
 *       - Paper
 *     summary: Upload a new paper version
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - paper
 *             properties:
 *               paper:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Paper uploaded successfully
 */
router.post(
  "/:id/upload",
  requireAuth,
  paperUpload.single("paper"),
  asyncHandler(paperController.uploadVersion)
);

/**
 * @openapi
 * /papers/{id}:
 *   delete:
 *     tags:
 *       - Paper
 *     summary: Delete paper
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Paper deleted successfully
 */
router.delete(
  "/:id",
  requireAuth,
  asyncHandler(paperController.delete)
);

export default router;