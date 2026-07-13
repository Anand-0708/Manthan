import { prisma } from "../../config/database";
import { Prisma } from "@prisma/client";

export const paperRepository = {
  create(data: Prisma.PaperCreateInput) {
    return prisma.paper.create({
      data,
      include: {
        track: true,
        author: true,
      },
    });
  },

  findById(id: string) {
    return prisma.paper.findUnique({
      where: { id },
      include: {
        track: true,
        author: true,
        authors: true,
        versions: true,
      },
    });
  },

  findByTrack(trackId: string) {
    return prisma.paper.findMany({
      where: { trackId },
      include: {
        author: true,
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

  delete(id: string) {
    return prisma.paper.delete({
      where: { id },
    });
  },
};