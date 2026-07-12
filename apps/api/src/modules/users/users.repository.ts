import { prisma } from "../../config/database";

export const usersRepository = {
  findById(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
    });
  },

  updateProfile(
    userId: string,
    data: {
      name?: string;
      affiliation?: string | null;
    }
  ) {
    return prisma.user.update({
      where: { id: userId },
      data,
    });
  },
};
