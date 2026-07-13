import { z } from "zod";

export const createConferenceSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().optional(),
  startDate: z.string(),
  endDate: z.string(),
  location: z.string().optional(),
});

export type CreateConferenceInput =
  z.infer<typeof createConferenceSchema>;
