import { Router } from "express";

import { requireAuth } from "../../common/middleware/auth.middleware";
import { validate } from "../../common/middleware/validate.middleware";
import { asyncHandler } from "../../common/middleware/asyncHandler.middleware";

import { trackController } from "./track.controller";
import {
  createTrackSchema,
  updateTrackSchema,
} from "./track.validators";

const router = Router();

/**
 * @openapi
 * /tracks/conference/{conferenceId}:
 *   post:
 *     tags:
 *       - Track
 *     summary: Create a new track for a conference
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conferenceId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Track created successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Conference not found
 */
router.post(
  "/conference/:conferenceId",
  requireAuth,
  validate(createTrackSchema),
  asyncHandler(trackController.create)
);

/**
 * @openapi
 * /tracks:
 *   get:
 *     tags:
 *       - Track
 *     summary: Search, filter and paginate tracks
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Track list retrieved successfully
 */
router.get(
  "/",
  requireAuth,
  asyncHandler(trackController.list)
);

/**
 * @openapi
 * /tracks/conference/{conferenceId}:
 *   get:
 *     tags:
 *       - Track
 *     summary: Get all tracks of a conference
 *     parameters:
 *       - in: path
 *         name: conferenceId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tracks retrieved successfully
 *       404:
 *         description: Conference not found
 */
router.get(
  "/conference/:conferenceId",
  asyncHandler(trackController.getByConference)
);

/**
 * @openapi
 * /tracks/{id}:
 *   get:
 *     tags:
 *       - Track
 *     summary: Get track by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Track retrieved successfully
 *       404:
 *         description: Track not found
 */
router.get(
  "/:id",
  asyncHandler(trackController.getById)
);

/**
 * @openapi
 * /tracks/{id}:
 *   patch:
 *     tags:
 *       - Track
 *     summary: Update track
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
 *         description: Track updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Track not found
 */
router.patch(
  "/:id",
  requireAuth,
  validate(updateTrackSchema),
  asyncHandler(trackController.update)
);

/**
 * @openapi
 * /tracks/{id}:
 *   delete:
 *     tags:
 *       - Track
 *     summary: Delete track
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
 *         description: Track deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Track not found
 */
router.delete(
  "/:id",
  requireAuth,
  asyncHandler(trackController.delete)
);

export default router;