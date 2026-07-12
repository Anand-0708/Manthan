import { Router } from "express";

import { requireAuth } from "../../common/middleware/auth.middleware";
import { validate } from "../../common/middleware/validate.middleware";

import { usersController } from "./users.controller";
import { updateProfileSchema } from "./users.validators";

const router = Router();

router.get(
  "/me",
  requireAuth,
  usersController.me
);

router.patch(
  "/me",
  requireAuth,
  validate(updateProfileSchema),
  usersController.updateMe
);

export default router;
