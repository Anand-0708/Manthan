import { Router } from "express";
import { requireAuth } from "../../common/middleware/auth.middleware";
import { validate } from "../../common/middleware/validate.middleware";

import { paperController } from "./paper.controller";
import {
  createPaperSchema,
  updatePaperSchema,
} from "./paper.validators";

const router = Router();

router.post(
  "/",
  requireAuth,
  validate(createPaperSchema),
  paperController.create
);

router.get(
  "/track/:trackId",
  paperController.getByTrack
);

router.get("/:id", paperController.getById);

router.patch(
  "/:id",
  requireAuth,
  validate(updatePaperSchema),
  paperController.update
);

router.delete(
  "/:id",
  requireAuth,
  paperController.delete
);

export default router;