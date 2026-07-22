import { Router } from "express";

import { requireAuth } from "../../common/middleware/auth.middleware";
import { validate } from "../../common/middleware/validate.middleware";
import { asyncHandler } from "../../common/middleware/asyncHandler.middleware";

import { conferenceController } from "./conference.controller";
import { createConferenceSchema } from "./conference.validators";

const router = Router();

/**
 * @openapi
 * /conferences:
 *   post:
 *     tags:
 *       - Conference
 *     summary: Create a new conference
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Conference created successfully
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  requireAuth,
  validate(createConferenceSchema),
  asyncHandler(conferenceController.create)
);

/**
 * @openapi
 * /conferences:
 *   get:
 *     tags:
 *       - Conference
 *     summary: Search, filter and paginate conferences
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Conference list retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/",
  requireAuth,
  asyncHandler(conferenceController.list)
);

/**
 * @openapi
 * /conferences/all:
 *   get:
 *     tags:
 *       - Conference
 *     summary: Get all conferences
 *     responses:
 *       200:
 *         description: List of all conferences
 */
router.get(
  "/all",
  asyncHandler(conferenceController.getAll)
);

/**
 * @openapi
 * /conferences/{id}:
 *   get:
 *     tags:
 *       - Conference
 *     summary: Get conference by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Conference retrieved successfully
 *       404:
 *         description: Conference not found
 */
router.get(
  "/:id",
  asyncHandler(conferenceController.getById)
);

export default router;