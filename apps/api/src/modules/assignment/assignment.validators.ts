import { z } from "zod";

export const createAssignmentSchema = z.object({
  paperId: z.string().uuid(),
  reviewerId: z.string().uuid(),
});

export type CreateAssignmentInput = z.infer<
  typeof createAssignmentSchema
>;