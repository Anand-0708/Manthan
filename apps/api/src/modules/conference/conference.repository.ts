import { prisma } from "../../config/database";

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

  findById(id: string) {
    return prisma.conference.findUnique({
      where: { id },
    });
  },
};