import { z } from "zod";

export const createPaperSchema = z.object({
  title: z.string().min(5).max(300),
  abstract: z.string().min(50),
  keywords: z.array(z.string()).min(3),
  trackId: z.string().uuid(),
});

export const updatePaperSchema = z.object({
  title: z.string().min(5).max(300).optional(),
  abstract: z.string().min(50).optional(),
  keywords: z.array(z.string()).optional(),
  status: z
    .enum([
      "DRAFT",
      "SUBMITTED",
      "UNDER_REVIEW",
      "ACCEPTED",
      "REJECTED",
    ])
    .optional(),
});
export const updatePaperStatusSchema = z.object({
  status: z.enum([
    "ACCEPTED",
    "REJECTED",
  ]),
});