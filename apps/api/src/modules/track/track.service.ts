import { AppError } from "../../common/utils/apiResponse";
import { trackRepository } from "./track.repository";
import type {
  CreateTrackInput,
  UpdateTrackInput,
  ListTrackQuery,
} from "./track.types";

export const trackService = {
  async create(
    conferenceId: string,
    data: CreateTrackInput
  ) {
    return trackRepository.create({
      conferenceId,
      ...data,
    });
  },

  async getByConference(conferenceId: string) {
    return trackRepository.findByConference(
      conferenceId
    );
  },

  async list(query: ListTrackQuery) {
    const tracks =
      await trackRepository.list(query);

    const total =
      await trackRepository.count(query);

    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 10);

    return {
      tracks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async getById(id: string) {
    const track =
      await trackRepository.findById(id);

    if (!track) {
      throw new AppError(
        404,
        "TRACK_NOT_FOUND",
        "Track not found"
      );
    }

    return track;
  },

  async update(
    id: string,
    data: UpdateTrackInput
  ) {
    await this.getById(id);

    return trackRepository.update(id, data);
  },

  async delete(id: string) {
    await this.getById(id);

    return trackRepository.delete(id);
  },
};