import { prisma } from "../../config/database";

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
      where: { conferenceId },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  findById(id: string) {
    return prisma.track.findUnique({
      where: { id },
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
      where: { id },
      data,
    });
  },

  delete(id: string) {
    return prisma.track.delete({
      where: { id },
    });
  },
};