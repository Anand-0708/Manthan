import type { Request, Response } from "express";
import { reviewService } from "./review.service";

export const reviewController = {
  async create(req: Request, res: Response) {
    const review = await reviewService.create(
      req.user!.id,
      req.body
    );

    res.status(201).json({
      success: true,
      data: review,
    });
  },

  // ⭐ NEW
  async list(req: Request, res: Response) {
    const result = await reviewService.list(
      req.query as any
    );

    res.json({
      success: true,
      data: result.reviews,
      pagination: result.pagination,
    });
  },

  async getByPaper(
    req: Request,
    res: Response
  ) {
    const reviews =
      await reviewService.getByPaper(
        req.params.paperId!
      );

    res.json({
      success: true,
      data: reviews,
    });
  },

  async myReviews(
    req: Request,
    res: Response
  ) {
    const reviews =
      await reviewService.getByReviewer(
        req.user!.id
      );

    res.json({
      success: true,
      data: reviews,
    });
  },
};