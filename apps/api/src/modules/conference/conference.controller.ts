import type { Request, Response } from "express";
import { conferenceService } from "./conference.service";

export const conferenceController = {
  async create(req: Request, res: Response) {
    const conference = await conferenceService.create(
      req.user!.id,
      req.body
    );

    res.status(201).json({
      success: true,
      data: conference,
    });
  },

  async getAll(_req: Request, res: Response) {
    const conferences = await conferenceService.getAll();

    res.json({
      success: true,
      data: conferences,
    });
  },

  async getById(req: Request, res: Response) {
    const conference = await conferenceService.getById(
      req.params.id!
    );

    res.json({
      success: true,
      data: conference,
    });
  },
};