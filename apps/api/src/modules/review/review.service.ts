import { prisma } from "../../config/database";
import { AppError } from "../../common/utils/apiResponse";
import { assignmentRepository } from "../assignment/assignment.repository";
import { emailService } from "../email/email.service";
import { reviewRepository } from "./review.repository";
import type {
  CreateReviewInput,
  ListReviewQuery,
} from "./review.types";

export const reviewService = {
  async create(
    reviewerId: string,
    data: CreateReviewInput
  ) {
    const assignment =
      await assignmentRepository.findById(
        data.assignmentId
      );

    if (!assignment) {
      throw new AppError(
        404,
        "ASSIGNMENT_NOT_FOUND",
        "Assignment not found"
      );
    }

    if (assignment.reviewerId !== reviewerId) {
      throw new AppError(
        403,
        "FORBIDDEN",
        "Only assigned reviewer can submit review."
      );
    }

    if (assignment.paperId !== data.paperId) {
      throw new AppError(
        400,
        "INVALID_ASSIGNMENT",
        "Assignment does not belong to this paper."
      );
    }

    const existingReview =
      await reviewRepository.findByAssignmentId(
        data.assignmentId
      );

    if (existingReview) {
      throw new AppError(
        409,
        "REVIEW_ALREADY_EXISTS",
        "Review already submitted for this assignment."
      );
    }

    // ✅ Transaction
    const review = await prisma.$transaction(
      async () => {
        return reviewRepository.create({
          assignmentId: data.assignmentId,
          reviewerId,
          paperId: data.paperId,
          score: data.score,
          strengths: data.strengths,
          weaknesses: data.weaknesses,
          comments: data.comments,
          recommendation:
            data.recommendation,
        });
      }
    );

    const chair =
      assignment.paper.track.conference.roles[0]?.user;

    if (chair) {
      await emailService.sendReviewSubmittedEmail(
        chair.email,
        chair.name,
        assignment.paper.title,
        assignment.reviewer.name
      );
    }

    const totalAssignments =
      await prisma.reviewAssignment.count({
        where: {
          paperId: data.paperId,
        },
      });

    const submittedReviews =
      await prisma.review.count({
        where: {
          paperId: data.paperId,
        },
      });

    if (
      totalAssignments > 0 &&
      submittedReviews === totalAssignments &&
      chair
    ) {
      await emailService.sendAllReviewsCompletedEmail(
        chair.email,
        chair.name,
        assignment.paper.title
      );
    }

    return review;
  },

  async list(query: ListReviewQuery) {
    const reviews =
      await reviewRepository.list(query);

    const total =
      await reviewRepository.count(query);

    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 10);

    return {
      reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async getByPaper(paperId: string) {
    return reviewRepository.findByPaper(
      paperId
    );
  },

  async getByReviewer(
    reviewerId: string
  ) {
    return reviewRepository.findByReviewer(
      reviewerId
    );
  },
};