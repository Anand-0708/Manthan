import { prisma } from "../../config/database";
import { Prisma, PaperStatus } from "@prisma/client";
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

export const paperRepository = {
  create(data: Prisma.PaperCreateInput) {
    return prisma.paper.create({
      data,
      include: {
        track: true,
        author: {
          select: safeUserSelect,
        },
      },
    });
  },

  findById(id: string) {
  return prisma.paper.findUnique({
    where: { id },
    include: {
      track: {
        include: {
          conference: true,
        },
      },
      author: {
        select: safeUserSelect,
      },
      authors: true,
      versions: true,
    },
  });
},

  findByTrack(trackId: string) {
    return prisma.paper.findMany({
      where: { trackId },
      include: {
        author: {
          select: safeUserSelect,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  update(id: string, data: Prisma.PaperUpdateInput) {
    return prisma.paper.update({
      where: { id },
      data,
    });
  },

  getLatestVersionNumber(paperId: string) {
  return prisma.paperVersion.findFirst({
    where: {
      paperId,
    },
    orderBy: {
      versionNumber: "desc",
    },
  });
},

createVersion(data: {
  paperId: string;
  versionNumber: number;
  fileUrl: string;
  fileName: string;
}) {
  return prisma.paperVersion.create({
    data,
  });
},

  delete(id: string) {
    return prisma.paper.delete({
      where: { id },
    });
  },
list(options: {
  search?: string;
  status?: PaperStatus;
  trackId?: string;
  authorId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "asc" | "desc";
}) {
  const {
    search,
    status,
    trackId,
    authorId,
    page,
    limit,
    sortBy,
    order,
  } = options;

  const { skip, take } = getPagination({
    page,
    limit,
  });

  return prisma.paper.findMany({
    where: {
      ...(status && { status }),
      ...(trackId && { trackId }),
      ...(authorId && { authorId }),
      ...(search && {
        title: contains(search),
      }),
    },

    include: {
      track: true,
      author: {
        select: safeUserSelect,
      },
    },

    skip,
    take,

    orderBy: getOrderBy(
      sortBy,
      order
    ) as Prisma.PaperOrderByWithRelationInput,
  });
},
count(options: {
  search?: string;
  status?: PaperStatus;
  trackId?: string;
  authorId?: string;
}) {
  const {
    search,
    status,
    trackId,
    authorId,
  } = options;

  return prisma.paper.count({
    where: {
      ...(status && { status }),
      ...(trackId && { trackId }),
      ...(authorId && { authorId }),
      ...(search && {
        title: contains(search),
      }),
    },
  });
},
};