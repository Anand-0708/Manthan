import { Router } from "express";
import { asyncHandler } from "../../common/middleware/asyncHandler.middleware";
import { emailController } from "./email.controller";

const router = Router();

/**
 * @openapi
 * /email/test:
 *   get:
 *     tags:
 *       - Email
 *     summary: Send a test email
 *     responses:
 *       200:
 *         description: Test email sent successfully
 *       500:
 *         description: Failed to send email
 */
router.get(
  "/test",
  asyncHandler(emailController.test)
);

export default router;