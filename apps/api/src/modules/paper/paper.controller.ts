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

  async getById(
    req: Request,
    res: Response
  ) {
    const paper =
      await paperService.getById(
        req.params.id!
      );

    res.json({
      success: true,
      data: paper,
    });
  },

  async getByTrack(
    req: Request,
    res: Response
  ) {
    const papers =
      await paperService.getByTrack(
        req.params.trackId!
      );

    res.json({
      success: true,
      data: papers,
    });
  },

  // ⭐ NEW API
  async list(
    req: Request,
    res: Response
  ) {
    const result =
      await paperService.list(req.query as any);

    res.json({
      success: true,
      data: result.papers,
      pagination: result.pagination,
    });
  },

  async update(
    req: Request,
    res: Response
  ) {
    const paper =
      await paperService.update(
        req.user!.id,
        req.params.id!,
        req.body
      );

    res.json({
      success: true,
      data: paper,
    });
  },

  async updateStatus(
    req: Request,
    res: Response
  ) {
    const paper =
      await paperService.updateStatus(
        req.user!.id,
        req.params.id!,
        req.body.status
      );

    res.json({
      success: true,
      data: paper,
    });
  },

  async uploadVersion(
    req: Request,
    res: Response
  ) {
    const version =
      await paperService.uploadVersion(
        req.user!.id,
        req.params.id!,
        req.file!
      );

    res.status(201).json({
      success: true,
      data: version,
    });
  },

  async delete(
    req: Request,
    res: Response
  ) {
    await paperService.delete(
      req.user!.id,
      req.params.id!
    );

    res.json({
      success: true,
      message:
        "Paper deleted successfully",
    });
  },
};