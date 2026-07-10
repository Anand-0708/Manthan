import type { Response } from "express";

interface ApiErrorBody {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

/**
 * A typed application error that carries an HTTP status and a machine-readable
 * code, so the error handler middleware can build a consistent response
 * without guessing.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: unknown;

  constructor(statusCode: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export function sendSuccess<T>(res: Response, data: T, statusCode = 200): Response {
  return res.status(statusCode).json(data);
}

export function sendError(res: Response, statusCode: number, code: string, message: string, details?: unknown): Response {
  const body: ApiErrorBody = { error: { code, message, details } };
  return res.status(statusCode).json(body);
}