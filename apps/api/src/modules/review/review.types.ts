import type { ReviewRecommendation } from "@prisma/client";

export interface CreateReviewInput {
  assignmentId: string;
  paperId: string;
  score: number;
  strengths?: string;
  weaknesses?: string;
  comments?: string;
  recommendation: ReviewRecommendation;
}

export interface ListReviewQuery {
  search?: string;
  reviewerId?: string;
  paperId?: string;
  recommendation?: ReviewRecommendation;
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "asc" | "desc";
}