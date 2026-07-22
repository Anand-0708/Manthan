import { Prisma, ReviewRecommendation } from "@prisma/client";
import { prisma } from "../../config/database";
import { contains } from "../../common/utils/search";
import { getPagination } from "../../common/utils/pagination";
import { getOrderBy } from "../../common/utils/sort";

const safeUserSelect = {
  id: true,
  email: true,
  name: true,
  affiliation: true,
  createdAt: true,
};

export const reviewRepository = {
  create(data: {
    assignmentId: string;
    reviewerId: string;
    paperId: string;
    score: number;
    strengths?: string;
    weaknesses?: string;
    comments?: string;
    recommendation: ReviewRecommendation;
  }) {
    return prisma.review.create({
      data,
      include: {
        reviewer: {
          select: safeUserSelect,
        },
        paper: true,
      },
    });
  },

  // ⭐ NEW
  list(options: {
    search?: string;
    reviewerId?: string;
    paperId?: string;
    recommendation?: ReviewRecommendation;
    page?: number;
    limit?: number;
    sortBy?: string;
    order?: "asc" | "desc";
  }) {
    const {
      search,
      reviewerId,
      paperId,
      recommendation,
      page,
      limit,
      sortBy,
      order,
    } = options;

    const { skip, take } = getPagination({
      page,
      limit,
    });

    return prisma.review.findMany({
      where: {
        ...(reviewerId && { reviewerId }),
        ...(paperId && { paperId }),
        ...(recommendation && { recommendation }),

        ...(search && {
          OR: [
            {
              reviewer: {
                name: contains(search),
              },
            },
            {
              paper: {
                title: contains(search),
              },
            },
            {
              comments: contains(search),
            },
          ],
        }),
      },

      include: {
        reviewer: {
          select: safeUserSelect,
        },
        paper: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
      },

      skip,
      take,

      orderBy:
        getOrderBy(
          sortBy,
          order
        ) as Prisma.ReviewOrderByWithRelationInput,
    });
  },

  // ⭐ NEW
  count(options: {
    search?: string;
    reviewerId?: string;
    paperId?: string;
    recommendation?: ReviewRecommendation;
  }) {
    const {
      search,
      reviewerId,
      paperId,
      recommendation,
    } = options;

    return prisma.review.count({
      where: {
        ...(reviewerId && { reviewerId }),
        ...(paperId && { paperId }),
        ...(recommendation && { recommendation }),

        ...(search && {
          OR: [
            {
              reviewer: {
                name: contains(search),
              },
            },
            {
              paper: {
                title: contains(search),
              },
            },
            {
              comments: contains(search),
            },
          ],
        }),
      },
    });
  },

  findByPaper(paperId: string) {
    return prisma.review.findMany({
      where: {
        paperId,
      },
      include: {
        reviewer: {
          select: safeUserSelect,
        },
      },
    });
  },

  findByReviewer(reviewerId: string) {
    return prisma.review.findMany({
      where: {
        reviewerId,
      },
      include: {
        paper: true,
      },
    });
  },

  findByAssignmentId(assignmentId: string) {
    return prisma.review.findUnique({
      where: {
        assignmentId,
      },
    });
  },
};