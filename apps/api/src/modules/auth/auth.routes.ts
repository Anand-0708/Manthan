import { Router } from "express";
import passport from "passport";

import { asyncHandler } from "../../common/utils/asyncHandler";
import { requireAuth } from "../../common/middleware/auth.middleware";
import { validate } from "../../common/middleware/validate.middleware";
import { authRateLimiter } from "../../common/middleware/rateLimiter.middleware";

import { authController } from "./auth.controller";
import { loginSchema, registerSchema } from "./auth.validators";

const router = Router();

// CSRF token endpoint
router.get("/csrf-token", authController.csrfToken);

// Email/password auth
router.post(
  "/register",
  authRateLimiter,
  validate(registerSchema),
  asyncHandler(authController.register)
);

router.post(
  "/login",
  authRateLimiter,
  validate(loginSchema),
  asyncHandler(authController.login)
);

router.post(
  "/refresh",
  authRateLimiter,
  asyncHandler(authController.refresh)
);

router.post(
  "/logout",
  asyncHandler(authController.logout)
);

// Current authenticated user
router.get(
  "/me",
  requireAuth,
  asyncHandler(authController.me)
);

// Google OAuth
router.get(
  "/google",
  authRateLimiter,
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

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