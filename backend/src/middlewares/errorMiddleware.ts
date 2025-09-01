import { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";
import { Env, Variables, ApiError } from "../types";

export async function errorHandler(
  c: Context<{ Bindings: Env; Variables: Variables }>,
  next: Next
) {
  try {
    await next();
  } catch (error) {
    console.error("Global error handler:", error);

    // Handle Hono HTTPException
    if (error instanceof HTTPException) {
      return c.json(
        {
          message: error.message,
          status: error.status,
        },
        error.status
      );
    }

    // Handle custom ApiError
    if (error instanceof Error && "status" in error) {
      const apiError = error as ApiError;
      return c.json(
        {
          message: apiError.message,
          code: apiError.code || "INTERNAL_ERROR",
        },
        (apiError.status as any) || 500
      );
    }

    // Handle Prisma errors
    if (
      error instanceof Error &&
      (error.constructor.name === "PrismaClientKnownRequestError" ||
        error.constructor.name === "PrismaClientValidationError" ||
        error.constructor.name === "PrismaClientUnknownRequestError")
    ) {
      return handlePrismaError(error, c);
    }

    // Handle validation errors
    if (error instanceof Error && error.name === "ZodError") {
      return c.json(
        {
          message: "Validation failed",
          errors: (error as any).errors,
        },
        400
      );
    }

    // Handle unknown errors
    return c.json(
      {
        message: "Internal Server Error",
        ...((c.env as any)?.NODE_ENV === "development" && {
          error: error instanceof Error ? error.message : String(error),
        }),
      },
      500
    );
  }
}

function handlePrismaError(error: Error, c: Context) {
  const prismaError = error as any;

  switch (prismaError.code) {
    case "P2002":
      return c.json({ message: "Resource already exists" }, 409);
    case "P2025":
      return c.json({ message: "Resource not found" }, 404);
    case "P2003":
      return c.json({ message: "Foreign key constraint failed" }, 400);
    default:
      return c.json({ message: "Database operation failed" }, 500);
  }
}

export class NotFoundError extends Error implements ApiError {
  status = 404;
  code = "NOT_FOUND";

  constructor(message = "Resource not found") {
    super(message);
    this.name = "NotFoundError";
  }
}

export class UnauthorizedError extends Error implements ApiError {
  status = 401;
  code = "UNAUTHORIZED";

  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error implements ApiError {
  status = 403;
  code = "FORBIDDEN";

  constructor(message = "Forbidden") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export class ValidationError extends Error implements ApiError {
  status = 400;
  code = "VALIDATION_ERROR";

  constructor(message = "Validation failed") {
    super(message);
    this.name = "ValidationError";
  }
}
