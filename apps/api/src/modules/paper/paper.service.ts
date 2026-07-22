import { AppError } from "../../common/utils/apiResponse";
import { paperRepository } from "./paper.repository";
import { prisma } from "../../config/database";
import { emailService } from "../email/email.service";
import type {
  CreatePaperInput,
  UpdatePaperInput,
  ListPaperQuery,
} from "./paper.types";

export const paperService = {
  async create(
    userId: string,
    data: CreatePaperInput
  ) {
    const paper = await paperRepository.create({
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

    const author = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (author) {
      await emailService.sendPaperSubmittedEmail(
        author.email,
        author.name,
        paper.title
      );
    }

    return paper;
  },

  async getById(id: string) {
    const paper =
      await paperRepository.findById(id);

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
    return paperRepository.findByTrack(
      trackId
    );
  },

  async list(query: ListPaperQuery) {
    const papers =
      await paperRepository.list(query);

    const total =
      await paperRepository.count(query);

    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 10);

    return {
      papers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async update(
    currentUserId: string,
    id: string,
    data: UpdatePaperInput
  ) {
    const paper = await this.getById(id);

    if (paper.authorId !== currentUserId) {
      throw new AppError(
        403,
        "FORBIDDEN",
        "You can only modify your own papers."
      );
    }

    return paperRepository.update(id, data);
  },

  async updateStatus(
    currentUserId: string,
    paperId: string,
    status: "ACCEPTED" | "REJECTED"
  ) {
    const paper = await this.getById(paperId);

    const chairRole =
      await prisma.conferenceRole.findFirst({
        where: {
          userId: currentUserId,
          conferenceId:
            paper.track.conference.id,
          role: "CHAIR",
        },
      });

    if (!chairRole) {
      throw new AppError(
        403,
        "FORBIDDEN",
        "Only conference chairs can change paper decisions."
      );
    }

    const updatedPaper =
      await paperRepository.update(
        paperId,
        {
          status,
        }
      );

    if (status === "ACCEPTED") {
      await emailService.sendPaperAcceptedEmail(
        paper.author.email,
        paper.author.name,
        paper.title
      );
    }

    if (status === "REJECTED") {
      await emailService.sendPaperRejectedEmail(
        paper.author.email,
        paper.author.name,
        paper.title
      );
    }

    return updatedPaper;
  },

  async uploadVersion(
    currentUserId: string,
    paperId: string,
    file: Express.Multer.File
  ) {
    const paper =
      await this.getById(paperId);

    if (paper.authorId !== currentUserId) {
      throw new AppError(
        403,
        "FORBIDDEN",
        "You can only upload versions for your own papers."
      );
    }

    const latestVersion =
      await paperRepository.getLatestVersionNumber(
        paperId
      );

    const versionNumber =
      latestVersion
        ? latestVersion.versionNumber + 1
        : 1;

    const version =
      await paperRepository.createVersion({
        paperId,
        versionNumber,
        fileUrl: file.path.replace(
          /\\/g,
          "/"
        ),
        fileName: file.originalname,
      });

    await emailService.sendPaperUploadedEmail(
      paper.author.email,
      paper.author.name,
      paper.title,
      versionNumber
    );

    return version;
  },

  async delete(
    currentUserId: string,
    id: string
  ) {
    const paper =
      await this.getById(id);

    if (paper.authorId !== currentUserId) {
      throw new AppError(
        403,
        "FORBIDDEN",
        "You can only delete your own papers."
      );
    }

    return paperRepository.delete(id);
  },
};