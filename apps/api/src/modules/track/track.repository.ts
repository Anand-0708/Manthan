import { prisma } from "../../config/database";
import { Prisma } from "@prisma/client";
import { contains } from "../../common/utils/search";
import { getPagination } from "../../common/utils/pagination";
import { getOrderBy } from "../../common/utils/sort";

export const trackRepository = {
  create(data: {
    conferenceId: string;
    name: string;
    description?: string;
  }) {
    return prisma.track.create({
      data,
    });
  },

  findByConference(conferenceId: string) {
    return prisma.track.findMany({
      where: {
        conferenceId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  list(options: {
    search?: string;
    conferenceId?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    order?: "asc" | "desc";
  }) {
    const {
      search,
      conferenceId,
      page,
      limit,
      sortBy,
      order,
    } = options;

    const { skip, take } = getPagination({
      page,
      limit,
    });

    return prisma.track.findMany({
      where: {
        ...(conferenceId && {
          conferenceId,
        }),

        ...(search && {
          OR: [
            {
              name: contains(search),
            },
            {
              description: contains(search),
            },
          ],
        }),
      },

      include: {
        conference: {
          select: {
            id: true,
            title: true,
          },
        },

        _count: {
          select: {
            papers: true,
          },
        },
      },

      skip,
      take,

      orderBy:
        getOrderBy(
          sortBy,
          order
        ) as Prisma.TrackOrderByWithRelationInput,
    });
  },

  count(options: {
    search?: string;
    conferenceId?: string;
  }) {
    const {
      search,
      conferenceId,
    } = options;

    return prisma.track.count({
      where: {
        ...(conferenceId && {
          conferenceId,
        }),

        ...(search && {
          OR: [
            {
              name: contains(search),
            },
            {
              description: contains(search),
            },
          ],
        }),
      },
    });
  },

  findById(id: string) {
    return prisma.track.findUnique({
      where: {
        id,
      },
      include: {
        conference: true,
        papers: true,
      },
    });
  },

  update(
    id: string,
    data: {
      name?: string;
      description?: string;
    }
  ) {
    return prisma.track.update({
      where: {
        id,
      },
      data,
    });
  },

  delete(id: string) {
    return prisma.track.delete({
      where: {
        id,
      },
    });
  },
};