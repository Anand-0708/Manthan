import type {AuditAction, User, Prisma } from "@prisma/client";
import { prisma } from "../../config/database";

export interface CreateUserInput {
  email: string;
  passwordHash: string;
  name: string;
  affiliation?: string;
}

export interface CreateRefreshTokenInput {
  userId: string;
  tokenHash: string;
  familyId: string;
  expiresAt: Date;
}

export interface CreateAuditLogInput {
  actorId: string | null;
  action: AuditAction;
  metadata?: Record<string, unknown>;
}

/**
 * All database access for the auth module lives here. Services never call
 * Prisma directly — this is the only layer that does.
 */
export const authRepository = {
  findUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  },

  findUserById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  },

  createUser(input: CreateUserInput): Promise<User> {
    return prisma.user.create({
      data: {
        email: input.email,
        passwordHash: input.passwordHash,
        name: input.name,
        affiliation: input.affiliation,
      },
    });
  },

  recordFailedLogin(
    userId: string,
    failedLoginAttempts: number,
    lockedUntil: Date | null
  ): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data: { failedLoginAttempts, lockedUntil },
    });
  },

  resetLoginAttempts(userId: string): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data: { failedLoginAttempts: 0, lockedUntil: null },
    });
  },

  createRefreshToken(input: CreateRefreshTokenInput) {
    return prisma.refreshToken.create({
      data: {
        userId: input.userId,
        tokenHash: input.tokenHash,
        familyId: input.familyId,
        expiresAt: input.expiresAt,
      },
    });
  },

  findRefreshTokenByHash(tokenHash: string) {
    return prisma.refreshToken.findUnique({ where: { tokenHash } });
  },

  revokeRefreshTokenById(id: string) {
    return prisma.refreshToken.update({ where: { id }, data: { revoked: true } });
  },

  revokeTokenFamily(familyId: string) {
    return prisma.refreshToken.updateMany({
      where: { familyId, revoked: false },
      data: { revoked: true },
    });
  },

  createAuditLog(input: CreateAuditLogInput) {
    return prisma.auditLog.create({
      data: {
        actorId: input.actorId,
        action: input.action,
        metadata: input.metadata as Prisma.InputJsonValue,
      },
    });
  },
};