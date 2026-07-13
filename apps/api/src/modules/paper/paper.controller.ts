import type { Request, Response } from "express";
import { paperService } from "./paper.service";

export const paperController = {
  async create(req: Request, res: Response) {
    const paper = await paperService.create(
      req.user!.id,
      req.body
    );

    res.status(201).json({
      success: true,
      data: paper,
    });
  },

  async getById(req: Request, res: Response) {
    const paper = await paperService.getById(
      req.params.id!
    );

    res.json({
      success: true,
      data: paper,
    });
  },

  async getByTrack(req: Request, res: Response) {
    const papers = await paperService.getByTrack(
      req.params.trackId!
    );

    res.json({
      success: true,
      data: papers,
    });
  },

  async update(req: Request, res: Response) {
    const paper = await paperService.update(
      req.params.id!,
      req.body
    );

    res.json({
      success: true,
      data: paper,
    });
  },

  async delete(req: Request, res: Response) {
    await paperService.delete(req.params.id!);

    res.json({
      success: true,
      message: "Paper deleted successfully",
    });
  },
};