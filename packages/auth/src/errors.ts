/**
 * Authorization error hierarchy for the vm-platform SaaS authorization layer.
 *
 * These errors carry HTTP status codes so that API route handlers can produce
 * consistent, safe responses without leaking internal details.
 */

export class AuthError extends Error {
  /** HTTP status code this error maps to. */
  public readonly statusCode: number;
  /** Machine-readable error code for API consumers. */
  public readonly code: string;

  constructor(message: string, statusCode: number, code: string) {
    super(message);
    this.name = "AuthError";
    this.statusCode = statusCode;
    this.code = code;
    // Restore prototype chain — required when extending built-in Error in ES5 targets.
    Object.setPrototypeOf(this, new.target.prototype);
  }

  toResponse(): { error: string; code: string } {
    return { error: this.message, code: this.code };
  }
}

/**
 * Thrown when there is no valid session or the session cannot be verified.
 * Maps to HTTP 401.
 */
export class UnauthorizedError extends AuthError {
  constructor(message = "Authentication required") {
    super(message, 401, "UNAUTHORIZED");
    this.name = "UnauthorizedError";
  }
}

/**
 * Thrown when the authenticated user does not have the required permission
 * or is not a member of the requested organization.
 * Maps to HTTP 403.
 */
export class ForbiddenError extends AuthError {
  constructor(message = "You do not have permission to perform this action") {
    super(message, 403, "FORBIDDEN");
    this.name = "ForbiddenError";
  }
}

/**
 * Thrown when a required resource (organization, membership) does not exist.
 * Maps to HTTP 404 — but is treated as 403 externally to avoid enumeration.
 */
export class NotFoundError extends AuthError {
  constructor(message = "Resource not found") {
    super(message, 404, "NOT_FOUND");
    this.name = "NotFoundError";
  }
}

/**
 * Thrown when a request would violate a uniqueness or conflict constraint.
 * Maps to HTTP 409.
 */
export class ConflictError extends AuthError {
  constructor(message = "This resource already exists") {
    super(message, 409, "CONFLICT");
    this.name = "ConflictError";
  }
}

/**
 * Utility to safely handle AuthErrors in API route handlers.
 * Returns a structured NextResponse-compatible payload.
 *
 * @example
 * try {
 *   const ctx = await requirePermission("org:update")(request);
 *   ...
 * } catch (err) {
 *   return handleAuthError(err);
 * }
 */
export function handleAuthError(err: unknown): {
  body: { error: string; code: string };
  status: number;
} {
  if (err instanceof AuthError) {
    return {
      body: err.toResponse(),
      status: err.statusCode,
    };
  }

  // Unknown error — log server-side, return generic message
  console.error("[AUTH] Unexpected error:", err);
  return {
    body: { error: "An internal server error occurred", code: "INTERNAL_ERROR" },
    status: 500,
  };
}
