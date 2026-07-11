import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";
import { sendError } from "../utils/apiResponse";

type ValidationTarget = "body" | "query" | "params";

/**
 * Generic request validation middleware — runs a Zod schema against the
 * given part of the request, replaces it with the parsed (and
 * coerced/defaulted) value on success, or responds 400 with field-level
 * errors on failure.
 *
 * Usage: router.post("/papers", validate(createPaperSchema), controller.create)
 */
export function validate(schema: ZodSchema, target: ValidationTarget = "body") {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      sendError(
        res,
        400,
        "VALIDATION_ERROR",
        "Request validation failed.",
        result.error.flatten().fieldErrors
      );
      return;
    }

    req[target] = result.data;
    next();
  };
}