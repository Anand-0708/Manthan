import type { User } from "@prisma/client";

/**
 * The user shape ever sent to the client — never includes passwordHash,
 * failedLoginAttempts, or lockedUntil.
 */
export interface SafeUser {
  id: string;
  email: string;
  name: string;
  affiliation: string | null;
  createdAt: Date;
}

export function toSafeUser(user: User): SafeUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    affiliation: user.affiliation,
    createdAt: user.createdAt,
  };
}