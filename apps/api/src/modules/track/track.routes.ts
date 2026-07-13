import { Router } from "express";

import { requireAuth } from "../../common/middleware/auth.middleware";
import { validate } from "../../common/middleware/validate.middleware";

import { trackController } from "./track.controller";
import {
  createTrackSchema,
  updateTrackSchema,
} from "./track.validators";

const router = Router();

router.post(
  "/conference/:conferenceId",
  requireAuth,
  validate(createTrackSchema),
  trackController.create
);

router.get(
  "/conference/:conferenceId",
  trackController.getByConference
);

router.get("/:id", trackController.getById);

router.patch(
  "/:id",
  requireAuth,
  validate(updateTrackSchema),
  trackController.update
);

router.delete(
  "/:id",
  requireAuth,
  trackController.delete
);

export default router;