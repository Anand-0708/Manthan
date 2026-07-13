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
  status?: "DRAFT" | "SUBMITTED" | "UNDER_REVIEW" | "ACCEPTED" | "REJECTED";
}