import { NextResponse } from "next/server";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export class ValidationError extends ApiError {
  constructor(message: string) {
    super(message, 400);
    this.name = "ValidationError";
  }
}

export class AuthenticationError extends ApiError {
  constructor(message = "Unauthorized") {
    super(message, 401);
    this.name = "AuthenticationError";
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = "Forbidden") {
    super(message, 403);
    this.name = "ForbiddenError";
  }
}

export class RateLimitError extends ApiError {
  retryAfterSeconds: number;

  constructor(message = "Too many requests.", retryAfterSeconds = 60) {
    super(message, 429);
    this.name = "RateLimitError";
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

export class NotFoundError extends ApiError {
  constructor(message = "Not found") {
    super(message, 404);
    this.name = "NotFoundError";
  }
}

export class ConfigurationError extends ApiError {
  constructor(message = "Server configuration is incomplete.") {
    super(message, 503);
    this.name = "ConfigurationError";
  }
}

export function handleRouteError(error: unknown, fallbackMessage: string) {
  if (error instanceof ApiError) {
    const response = NextResponse.json({ error: error.message }, { status: error.status });

    if (error instanceof RateLimitError) {
      response.headers.set("Retry-After", String(error.retryAfterSeconds));
    }

    return response;
  }

  console.error(fallbackMessage, error);
  return NextResponse.json({ error: fallbackMessage }, { status: 500 });
}
