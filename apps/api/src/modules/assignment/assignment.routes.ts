import { Router } from "express";

import { requireAuth } from "../../common/middleware/auth.middleware";
import { validate } from "../../common/middleware/validate.middleware";
import { asyncHandler } from "../../common/middleware/asyncHandler.middleware";

import { assignmentController } from "./assignment.controller";
import { createAssignmentSchema } from "./assignment.validators";

const router = Router();

/**
 * @openapi
 * /assignments:
 *   post:
 *     tags:
 *       - Assignment
 *     summary: Assign a reviewer to a paper
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Reviewer assigned successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Paper or Reviewer not found
 */
router.post(
  "/",
  requireAuth,
  validate(createAssignmentSchema),
  asyncHandler(assignmentController.create)
);

/**
 * @openapi
 * /assignments:
 *   get:
 *     tags:
 *       - Assignment
 *     summary: Search, filter and paginate assignments
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Assignment list retrieved successfully
 */
router.get(
  "/",
  requireAuth,
  asyncHandler(assignmentController.list)
);

/**
 * @openapi
 * /assignments/paper/{paperId}:
 *   get:
 *     tags:
 *       - Assignment
 *     summary: Get assignments of a paper
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
 *         description: Assignments retrieved successfully
 *       404:
 *         description: Paper not found
 */
router.get(
  "/paper/:paperId",
  requireAuth,
  asyncHandler(assignmentController.getByPaper)
);

/**
 * @openapi
 * /assignments/{id}:
 *   delete:
 *     tags:
 *       - Assignment
 *     summary: Remove reviewer assignment
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
 *         description: Assignment removed successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Assignment not found
 */
router.delete(
  "/:id",
  requireAuth,
  asyncHandler(assignmentController.remove)
);

export default router;