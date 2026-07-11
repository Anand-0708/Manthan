import { Router } from "express";
import { asyncHandler } from "../../common/utils/asyncHandler";
import { requireAuth } from "../../common/middleware/auth.middleware";
import { validate } from "../../common/middleware/validate.middleware";
import { authController } from "./auth.controller";
import { loginSchema, registerSchema } from "./auth.validators";

const router = Router();

router.post("/register", validate(registerSchema), asyncHandler(authController.register));
router.post("/login", validate(loginSchema), asyncHandler(authController.login));
router.post("/refresh", asyncHandler(authController.refresh));
router.post("/logout", asyncHandler(authController.logout));
router.get("/me", requireAuth, asyncHandler(authController.me));

// NOTE: Google OAuth routes (/google, /google/callback) and the CSRF
// token endpoint (/csrf-token) are added in the next sections.

export default router;