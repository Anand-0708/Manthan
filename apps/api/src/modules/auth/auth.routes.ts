import { Router } from "express";
import passport from "passport";

import { asyncHandler } from "../../common/utils/asyncHandler";
import { requireAuth } from "../../common/middleware/auth.middleware";
import { validate } from "../../common/middleware/validate.middleware";
import { authRateLimiter } from "../../common/middleware/rateLimiter.middleware";

import { authController } from "./auth.controller";
import { loginSchema, registerSchema } from "./auth.validators";

const router = Router();

/**
 * @openapi
 * /auth/csrf-token:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Get CSRF token
 *     responses:
 *       200:
 *         description: CSRF token generated
 */
router.get("/csrf-token", authController.csrfToken);

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Anand
 *               email:
 *                 type: string
 *                 format: email
 *                 example: anand@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password@123
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 */
router.post(
  "/register",
  authRateLimiter,
  validate(registerSchema),
  asyncHandler(authController.register)
);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: anand@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password@123
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post(
  "/login",
  authRateLimiter,
  validate(loginSchema),
  asyncHandler(authController.login)
);

/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Refresh access token
 *     responses:
 *       200:
 *         description: Token refreshed
 */
router.post(
  "/refresh",
  authRateLimiter,
  asyncHandler(authController.refresh)
);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Logout current user
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post(
  "/logout",
  asyncHandler(authController.logout)
);

/**
 * @openapi
 * /auth/me:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Get current authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user details
 *       401:
 *         description: Authentication required
 */
router.get(
  "/me",
  requireAuth,
  asyncHandler(authController.me)
);

/**
 * @openapi
 * /auth/google:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Google OAuth login
 *     responses:
 *       302:
 *         description: Redirect to Google
 */
router.get(
  "/google",
  authRateLimiter,
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

/**
 * @openapi
 * /auth/google/callback:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Google OAuth callback
 *     responses:
 *       302:
 *         description: Authentication completed
 */
router.get(
  "/google/callback",
  authRateLimiter,
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  authController.googleCallback
);

export default router;