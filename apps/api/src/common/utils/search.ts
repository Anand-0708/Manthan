export function contains(value?: string) {
  if (!value) return undefined;

  return {
    contains: value,
    mode: "insensitive" as const,
  };
}