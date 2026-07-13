import { z } from "zod";

export const createTrackSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().optional(),
});

export const updateTrackSchema = createTrackSchema.partial();

export type CreateTrackInput = z.infer<typeof createTrackSchema>;
export type UpdateTrackInput = z.infer<typeof updateTrackSchema>;