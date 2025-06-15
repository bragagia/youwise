import { TRPCError } from "@trpc/server";

export class UnauthorizedError extends TRPCError {
  constructor(message?: string, cause?: unknown) {
    super({
      message: message ?? "You are not authorized to perform this action.",
      code: "UNAUTHORIZED",
      cause: cause,
    });
  }
}

export class NotFoundError extends TRPCError {
  constructor(message?: string, cause?: unknown) {
    super({
      message: message ?? "The requested resource was not found.",
      code: "NOT_FOUND",
      cause: cause,
    });
  }
}

export class InternalServerError extends TRPCError {
  constructor(message?: string, cause?: unknown) {
    super({
      message: message ?? "An unexpected error occurred.",
      code: "INTERNAL_SERVER_ERROR",
      cause: cause,
    });
  }
}

export class ForbiddenError extends TRPCError {
  constructor(message?: string, cause?: unknown) {
    super({
      message: message ?? "You do not have permission to access this resource.",
      code: "FORBIDDEN",
      cause: cause,
    });
  }
}

export class BadRequestError extends TRPCError {
  constructor(message?: string, cause?: unknown) {
    super({
      message: message ?? "The request was invalid or cannot be served.",
      code: "BAD_REQUEST",
      cause: cause,
    });
  }
}
