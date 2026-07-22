import { Prisma } from "@prisma/client";
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

export const assignmentRepository = {
  create(data: {
    paperId: string;
    reviewerId: string;
  }) {
    return prisma.reviewAssignment.create({
      data,
      include: {
        reviewer: {
          select: safeUserSelect,
        },
        paper: true,
      },
    });
  },
findExistingAssignment(
  paperId: string,
  reviewerId: string
) {
  return prisma.reviewAssignment.findFirst({
    where: {
      paperId,
      reviewerId,
    },
  });
},
  // ⭐ NEW
  list(options: {
    search?: string;
    reviewerId?: string;
    paperId?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    order?: "asc" | "desc";
  }) {
    const {
      search,
      reviewerId,
      paperId,
      page,
      limit,
      sortBy,
      order,
    } = options;

    const { skip, take } = getPagination({
      page,
      limit,
    });

    return prisma.reviewAssignment.findMany({
      where: {
        ...(reviewerId && { reviewerId }),
        ...(paperId && { paperId }),

        ...(search && {
          OR: [
            {
              reviewer: {
                name: contains(search),
              },
            },
            {
              reviewer: {
                email: contains(search),
              },
            },
            {
              paper: {
                title: contains(search),
              },
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
        ) as Prisma.ReviewAssignmentOrderByWithRelationInput,
    });
  },

  // ⭐ NEW
  count(options: {
    search?: string;
    reviewerId?: string;
    paperId?: string;
  }) {
    const {
      search,
      reviewerId,
      paperId,
    } = options;

    return prisma.reviewAssignment.count({
      where: {
        ...(reviewerId && { reviewerId }),
        ...(paperId && { paperId }),

        ...(search && {
          OR: [
            {
              reviewer: {
                name: contains(search),
              },
            },
            {
              reviewer: {
                email: contains(search),
              },
            },
            {
              paper: {
                title: contains(search),
              },
            },
          ],
        }),
      },
    });
  },

  findByPaper(paperId: string) {
    return prisma.reviewAssignment.findMany({
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

  findById(id: string) {
    return prisma.reviewAssignment.findUnique({
      where: {
        id,
      },
      include: {
        reviewer: {
          select: safeUserSelect,
        },
        paper: {
          include: {
            author: {
              select: safeUserSelect,
            },
            track: {
              include: {
                conference: {
                  include: {
                    roles: {
                      where: {
                        role: "CHAIR",
                      },
                      include: {
                        user: {
                          select: safeUserSelect,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  },

  delete(id: string) {
    return prisma.reviewAssignment.delete({
      where: {
        id,
      },
    });
  },
};