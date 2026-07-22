export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export function getPagination(query: PaginationQuery) {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.max(Number(query.limit) || 10, 1);

  return {
    page,
    limit,
    skip: (page - 1) * limit,
    take: limit,
  };
}