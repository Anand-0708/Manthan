export interface CreateConferenceInput {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  location?: string;
}