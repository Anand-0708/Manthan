export interface CreatePaperInput {
  title: string;
  abstract: string;
  keywords: string[];
  trackId: string;
}

export interface UpdatePaperInput {
  title?: string;
  abstract?: string;
  keywords?: string[];
  status?:
    | "DRAFT"
    | "SUBMITTED"
    | "UNDER_REVIEW"
    | "ACCEPTED"
    | "REJECTED";
}

export interface ListPaperQuery {
  search?: string;
  status?:
    | "DRAFT"
    | "SUBMITTED"
    | "UNDER_REVIEW"
    | "ACCEPTED"
    | "REJECTED";
  trackId?: string;
  authorId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "asc" | "desc";
}