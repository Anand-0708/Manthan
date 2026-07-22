import { prisma } from "../../config/database";

export const dashboardRepository = {
  async getChairStats(userId: string) {
    return Promise.all([
      prisma.conference.count({
        where: {
          createdById: userId,
        },
      }),

      prisma.track.count({
        where: {
          conference: {
            createdById: userId,
          },
        },
      }),

      prisma.paper.count({
        where: {
          track: {
            conference: {
              createdById: userId,
            },
          },
        },
      }),

      prisma.paper.count({
        where: {
          status: "ACCEPTED",
          track: {
            conference: {
              createdById: userId,
            },
          },
        },
      }),

      prisma.paper.count({
        where: {
          status: "REJECTED",
          track: {
            conference: {
              createdById: userId,
            },
          },
        },
      }),

      prisma.paper.count({
        where: {
          status: "UNDER_REVIEW",
          track: {
            conference: {
              createdById: userId,
            },
          },
        },
      }),

      prisma.paper.count({
        where: {
          status: "DRAFT",
          track: {
            conference: {
              createdById: userId,
            },
          },
        },
      }),

      prisma.user.count({
        where: {
          conferenceRoles: {
            some: {
              role: "REVIEWER",
              conference: {
                createdById: userId,
              },
            },
          },
        },
      }),

      prisma.reviewAssignment.count({
        where: {
          review: null,
          paper: {
            track: {
              conference: {
                createdById: userId,
              },
            },
          },
        },
      }),

      prisma.review.count({
        where: {
          paper: {
            track: {
              conference: {
                createdById: userId,
              },
            },
          },
        },
      }),
    ]);
  },

  async getAuthorStats(userId: string) {
    return Promise.all([
      prisma.paper.count({
        where: {
          authorId: userId,
        },
      }),

      prisma.paper.count({
        where: {
          authorId: userId,
          status: "DRAFT",
        },
      }),

      prisma.paper.count({
        where: {
          authorId: userId,
          status: "SUBMITTED",
        },
      }),

      prisma.paper.count({
        where: {
          authorId: userId,
          status: "UNDER_REVIEW",
        },
      }),

      prisma.paper.count({
        where: {
          authorId: userId,
          status: "ACCEPTED",
        },
      }),

      prisma.paper.count({
        where: {
          authorId: userId,
          status: "REJECTED",
        },
      }),
    ]);
  },

  async getReviewerStats(userId: string) {
    return Promise.all([
      prisma.reviewAssignment.count({
        where: {
          reviewerId: userId,
        },
      }),

      prisma.review.count({
        where: {
          reviewerId: userId,
        },
      }),

      prisma.reviewAssignment.count({
        where: {
          reviewerId: userId,
          review: null,
        },
      }),

      prisma.review.count({
        where: {
          reviewerId: userId,
          recommendation: "ACCEPT",
        },
      }),

      prisma.review.count({
        where: {
          reviewerId: userId,
          recommendation: "REJECT",
        },
      }),
    ]);
  },
};