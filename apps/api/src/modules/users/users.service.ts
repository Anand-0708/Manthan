import { AppError } from "../../common/utils/apiResponse";
import { usersRepository } from "./users.repository";

export const usersService = {
  async getProfile(userId: string) {
    const user = await usersRepository.findById(userId);

    if (!user) {
      throw new AppError(404, "USER_NOT_FOUND", "User not found");
    }

    return user;
  },

  async updateProfile(
    userId: string,
    data: {
      name?: string;
      affiliation?: string | null;
    }
  ) {
    return usersRepository.updateProfile(userId, data);
  },
};
