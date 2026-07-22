export function getOrderBy(
  sortBy = "createdAt",
  order: "asc" | "desc" = "desc"
) {
  return {
    [sortBy]: order,
  };
}