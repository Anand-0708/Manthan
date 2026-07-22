import type {
  NextFunction,
  Request,
  Response,
} from "express";
import {
  ConferenceRoleType,
  Prisma,
} from "@prisma/client";

import { prisma } from "../../config/database";
import { AppError } from "../utils/apiResponse";

export function requireRole(
  role: ConferenceRoleType
) {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    try {
      let conferenceId: string | undefined;

      // Direct conferenceId
      conferenceId =
        (req.params.conferenceId as string) ||
        (req.body.conferenceId as string) ||
        (req.query.conferenceId as string);

      // Track → Conference
      if (!conferenceId && req.params.trackId) {
        const track =
          await prisma.track.findUnique({
            where: {
              id: req.params.trackId,
            },
            select: {
              conferenceId: true,
            },
          });

        conferenceId = track?.conferenceId;
      }

      // Paper → Track → Conference
      if (
        !conferenceId &&
        (req.params.paperId ||
          req.body.paperId)
      ) {
        const paper =
          await prisma.paper.findUnique({
            where: {
              id:
                req.params.paperId ??
                req.body.paperId,
            },
            select: {
              track: {
                select: {
                  conferenceId: true,
                },
              },
            },
          });

        conferenceId =
          paper?.track.conferenceId;
      }

      // Assignment → Paper → Track → Conference
      if (
        !conferenceId &&
        req.body.assignmentId
      ) {
        const assignment =
          await prisma.reviewAssignment.findUnique(
            {
              where: {
                id: req.body.assignmentId,
              },
              select: {
                paper: {
                  select: {
                    track: {
                      select: {
                        conferenceId: true,
                      },
                    },
                  },
                },
              },
            }
            );

        conferenceId =
          assignment?.paper.track
            .conferenceId;
      }

      if (!conferenceId) {
        return next(
          new AppError(
            400,
            "CONFERENCE_NOT_FOUND",
            "Unable to determine conference."
          )
        );
      }

      const userRole =
        await prisma.conferenceRole.findFirst({
          where: {
            conferenceId,
            userId: req.user!.id,
            role,
          },
        });

      if (!userRole) {
        return next(
          new AppError(
            403,
            "FORBIDDEN",
            "You do not have permission to perform this action."
          )
        );
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}