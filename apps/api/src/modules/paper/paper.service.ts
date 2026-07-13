import { AppError } from "../../common/utils/apiResponse";
import { paperRepository } from "./paper.repository";
import type {
  CreatePaperInput,
  UpdatePaperInput,
} from "./paper.types";

export const paperService = {
  async create(userId: string, data: CreatePaperInput) {
    return paperRepository.create({
      title: data.title,
      abstract: data.abstract,
      keywords: data.keywords,
      status: "DRAFT",
      author: {
        connect: {
          id: userId,
        },
      },
      track: {
        connect: {
          id: data.trackId,
        },
      },
    });
  },

  async getById(id: string) {
    const paper = await paperRepository.findById(id);

    if (!paper) {
      throw new AppError(
        404,
        "PAPER_NOT_FOUND",
        "Paper not found"
      );
    }

    return paper;
  },

  async getByTrack(trackId: string) {
    return paperRepository.findByTrack(trackId);
  },

  async update(id: string, data: UpdatePaperInput) {
    await this.getById(id);
    return paperRepository.update(id, data);
  },

  async delete(id: string) {
    await this.getById(id);
    return paperRepository.delete(id);
  },
};