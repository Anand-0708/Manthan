export interface CreateTrackInput {
  name: string;
  description?: string;
}

export interface UpdateTrackInput {
  name?: string;
  description?: string;
}