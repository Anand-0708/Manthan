import { z } from "zod";
import { DEFAULT_PAGE, DEFAULT_PAGE_LIMIT, MAX_PAGE_LIMIT } from "../constants/pagination";

/**
 * Generic pagination query params, reused by any list endpoint
 * (e.g. `?page=1&limit=20`). Module-specific filters (status, track_id,
 * mine, etc.) are added by extending this schema (`.merge(...)`) within
 * the module that defines them, once that module is implemented.
 */
export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(DEFAULT_PAGE),
  limit: z.coerce.number().int().positive().max(MAX_PAGE_LIMIT).default(DEFAULT_PAGE_LIMIT),
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;