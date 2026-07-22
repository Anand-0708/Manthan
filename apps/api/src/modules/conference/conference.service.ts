import { prisma } from "../../config/database";
import { AppError } from "../../common/utils/apiResponse";
import { conferenceRepository } from "./conference.repository";
import type {
  CreateConferenceInput,
  ListConferenceQuery,
} from "./conference.types";
import { emailService } from "../email/email.service";

export const conferenceService = {
  async create(
    userId: string,
    data: CreateConferenceInput
  ) {
    // Transaction: Conference + Chair Role
    const conference = await prisma.$transaction(
      async (tx) => {
        const conference =
          await tx.conference.create({
            data: {
              title: data.title,
              description: data.description,
              startDate: new Date(data.startDate),
              endDate: new Date(data.endDate),
              location: data.location,
              createdById: userId,
            },
          });

        await tx.conferenceRole.create({
          data: {
            conferenceId: conference.id,
            userId,
            role: "CHAIR",
          },
        });

        return conference;
      }
    );

    // Email transaction ke bahar
    const chair = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (chair) {
      await emailService.sendConferenceCreatedEmail(
        chair.email,
        chair.name,
        conference.title
      );
    }

    return conference;
  },

  async getAll() {
    return conferenceRepository.findAll();
  },

  async list(query: ListConferenceQuery) {
    const conferences =
      await conferenceRepository.list(query);

    const total =
      await conferenceRepository.count(query);

    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 10);

    return {
      conferences,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async getById(id: string) {
    const conference =
      await conferenceRepository.findById(id);

    if (!conference) {
      throw new AppError(
        404,
        "CONFERENCE_NOT_FOUND",
        "Conference not found"
      );
    }

    return conference;
  },
};