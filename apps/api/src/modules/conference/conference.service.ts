import { AppError } from "../../common/utils/apiResponse";
import { conferenceRepository } from "./conference.repository";
import type { CreateConferenceInput } from "./conference.types";

export const conferenceService = {
  async create(userId: string, data: CreateConferenceInput) {
    return conferenceRepository.create({
      title: data.title,
      description: data.description,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      location: data.location,
      createdById: userId,
    });
  },

  async getAll() {
    return conferenceRepository.findAll();
  },

  async getById(id: string) {
    const conference = await conferenceRepository.findById(id);

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