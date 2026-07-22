export interface CreateConferenceInput {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  location?: string;
}

export interface ListConferenceQuery {
  search?: string;
  createdById?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "asc" | "desc";
}