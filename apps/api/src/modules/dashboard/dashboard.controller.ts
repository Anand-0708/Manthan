import type {
  Request,
  Response,
} from "express";

import { dashboardService } from "./dashboard.service";

export const dashboardController = {
  async chair(
    req: Request,
    res: Response
  ) {
    const data =
      await dashboardService.getChairDashboard(
        req.user!.id
      );

    res.json({
      success: true,
      data,
    });
  },

  async author(
    req: Request,
    res: Response
  ) {
    const data =
      await dashboardService.getAuthorDashboard(
        req.user!.id
      );

    res.json({
      success: true,
      data,
    });
  },

  async reviewer(
    req: Request,
    res: Response
  ) {
    const data =
      await dashboardService.getReviewerDashboard(
        req.user!.id
      );

    res.json({
      success: true,
      data,
    });
  },
};