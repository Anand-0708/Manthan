import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  affiliation: z.string().max(200).nullable().optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
