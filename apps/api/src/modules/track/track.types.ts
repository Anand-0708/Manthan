export interface CreateTrackInput {
  name: string;
  description?: string;
}

export interface UpdateTrackInput {
  name?: string;
  description?: string;
}

export interface ListTrackQuery {
  search?: string;
  conferenceId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "asc" | "desc";
}