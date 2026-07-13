import { Router } from "express";

import { requireAuth } from "../../common/middleware/auth.middleware";
import { validate } from "../../common/middleware/validate.middleware";

import { conferenceController } from "./conference.controller";
import { createConferenceSchema } from "./conference.validators";

const router = Router();

router.post(
  "/",
  requireAuth,
  validate(createConferenceSchema),
  conferenceController.create
);

router.get("/", conferenceController.getAll);

router.get("/:id", conferenceController.getById);

export default router;
