import type { Request, Response } from "express";
import { usersService } from "./users.service";

export const usersController = {
  async me(req: Request, res: Response) {
    const user = await usersService.getProfile(req.user!.id);

    res.json({
      success: true,
      data: user,
    });
  },

  async updateMe(req: Request, res: Response) {
    const user = await usersService.updateProfile(
      req.user!.id,
      req.body
    );

    res.json({
      success: true,
      data: user,
    });
  },
};
