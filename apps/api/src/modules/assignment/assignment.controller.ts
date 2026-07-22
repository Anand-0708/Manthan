import type { Request, Response } from "express";
import { assignmentService } from "./assignment.service";

export const assignmentController = {
  async create(req: Request, res: Response) {
    const assignment =
      await assignmentService.create(
        req.user!.id,
        req.body.paperId,
        req.body.reviewerId
      );

    res.status(201).json({
      success: true,
      data: assignment,
    });
  },

  // ⭐ NEW
  async list(req: Request, res: Response) {
    const result =
      await assignmentService.list(
        req.query as any
      );

    res.json({
      success: true,
      data: result.assignments,
      pagination: result.pagination,
    });
  },

  async getByPaper(
    req: Request,
    res: Response
  ) {
    const assignments =
      await assignmentService.getByPaper(
        req.params.paperId!
      );

    res.json({
      success: true,
      data: assignments,
    });
  },

  async remove(
    req: Request,
    res: Response
  ) {
    await assignmentService.remove(
      req.params.id!
    );

    res.json({
      success: true,
      message:
        "Assignment removed successfully",
    });
  },
};