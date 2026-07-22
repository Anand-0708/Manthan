import { prisma } from "../../config/database";
import { AppError } from "../../common/utils/apiResponse";
import { assignmentRepository } from "./assignment.repository";
import { paperRepository } from "../paper/paper.repository";
import { emailService } from "../email/email.service";
import type { ListAssignmentQuery } from "./assignment.types";

export const assignmentService = {
  async create(
    currentUserId: string,
    paperId: string,
    reviewerId: string
  ) {
    const paper = await paperRepository.findById(
      paperId
    );

    if (!paper) {
      throw new AppError(
        404,
        "PAPER_NOT_FOUND",
        "Paper not found"
      );
    }

    const chairRole =
      await prisma.conferenceRole.findFirst({
        where: {
          conferenceId:
            paper.track.conference.id,
          userId: currentUserId,
          role: "CHAIR",
        },
      });

    if (!chairRole) {
      throw new AppError(
        403,
        "FORBIDDEN",
        "Only conference chairs can assign reviewers."
      );
    }

    // ✅ Prevent duplicate assignment
    const existingAssignment =
      await assignmentRepository.findExistingAssignment(
        paperId,
        reviewerId
      );

    if (existingAssignment) {
      throw new AppError(
        409,
        "ASSIGNMENT_ALREADY_EXISTS",
        "Reviewer is already assigned to this paper."
      );
    }

    const assignment =
      await assignmentRepository.create({
        paperId,
        reviewerId,
      });

    await emailService.sendReviewerAssignmentEmail(
      assignment.reviewer.email,
      assignment.reviewer.name,
      assignment.paper.title
    );

    return assignment;
  },

  async list(query: ListAssignmentQuery) {
    const assignments =
      await assignmentRepository.list(query);

    const total =
      await assignmentRepository.count(query);

    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 10);

    return {
      assignments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async getByPaper(paperId: string) {
    return assignmentRepository.findByPaper(
      paperId
    );
  },

  async remove(id: string) {
    const assignment =
      await assignmentRepository.findById(id);

    if (!assignment) {
      throw new AppError(
        404,
        "ASSIGNMENT_NOT_FOUND",
        "Assignment not found"
      );
    }

    return assignmentRepository.delete(id);
  },
};