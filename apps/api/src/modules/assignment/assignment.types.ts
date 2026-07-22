export interface CreateAssignmentInput {
  paperId: string;
  reviewerId: string;
}

export interface ListAssignmentQuery {
  search?: string;
  reviewerId?: string;
  paperId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "asc" | "desc";
}