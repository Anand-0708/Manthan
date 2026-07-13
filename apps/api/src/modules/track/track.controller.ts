import type { Request, Response } from "express";
import { trackService } from "./track.service";

export const trackController = {
  async create(req: Request, res: Response) {
    const track = await trackService.create(
      req.params.conferenceId!,
      req.body
    );

    res.status(201).json({
      success: true,
      data: track,
    });
  },

  async getByConference(
    req: Request,
    res: Response
  ) {
    const tracks =
      await trackService.getByConference(
        req.params.conferenceId!
      );

    res.json({
      success: true,
      data: tracks,
    });
  },

  async getById(req: Request, res: Response) {
    const track = await trackService.getById(
      req.params.id!
    );

    res.json({
      success: true,
      data: track,
    });
  },

  async update(req: Request, res: Response) {
    const track = await trackService.update(
      req.params.id!,
      req.body
    );

    res.json({
      success: true,
      data: track,
    });
  },

  async delete(req: Request, res: Response) {
    await trackService.delete(req.params.id!);

    res.json({
      success: true,
      message: "Track deleted successfully",
    });
  },
};