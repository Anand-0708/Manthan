import { z } from "zod";

export const createReviewSchema = z.object({
  assignmentId: z.string().uuid(),
  paperId: z.string().uuid(),
  score: z.number().min(1).max(10),

  strengths: z.string().optional(),
  weaknesses: z.string().optional(),
  comments: z.string().optional(),

  recommendation: z.enum([
    "ACCEPT",
    "MINOR_REVISION",
    "MAJOR_REVISION",
    "REJECT",
  ]),
});

export type CreateReviewInput = z.infer<
  typeof createReviewSchema
>;