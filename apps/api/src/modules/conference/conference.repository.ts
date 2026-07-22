import { prisma } from "../../config/database";
import { Prisma } from "@prisma/client";
import { contains } from "../../common/utils/search";
import { getPagination } from "../../common/utils/pagination";
import { getOrderBy } from "../../common/utils/sort";

export interface CreateConferenceDbInput {
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  createdById: string;
}

export const conferenceRepository = {
  create(data: CreateConferenceDbInput) {
    return prisma.conference.create({
      data,
    });
  },

  findAll() {
    return prisma.conference.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  list(options: {
    search?: string;
    createdById?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    order?: "asc" | "desc";
  }) {
    const {
      search,
      createdById,
      page,
      limit,
      sortBy,
      order,
    } = options;

    const { skip, take } = getPagination({
      page,
      limit,
    });

    return prisma.conference.findMany({
      where: {
        ...(createdById && { createdById }),

        ...(search && {
          OR: [
            {
              title: contains(search),
            },
            {
              description: contains(search),
            },
            {
              location: contains(search),
            },
          ],
        }),
      },

      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },

        _count: {
          select: {
            tracks: true,
            roles: true,
          },
        },
      },

      skip,
      take,

      orderBy:
        getOrderBy(
          sortBy,
          order
        ) as Prisma.ConferenceOrderByWithRelationInput,
    });
  },

  count(options: {
    search?: string;
    createdById?: string;
  }) {
    const {
      search,
      createdById,
    } = options;

    return prisma.conference.count({
      where: {
        ...(createdById && { createdById }),

        ...(search && {
          OR: [
            {
              title: contains(search),
            },
            {
              description: contains(search),
            },
            {
              location: contains(search),
            },
          ],
        }),
      },
    });
  },

  findById(id: string) {
    return prisma.conference.findUnique({
      where: {
        id,
      },
      include: {
        tracks: true,
        roles: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
  },
};