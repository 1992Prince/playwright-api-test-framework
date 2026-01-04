/**
 * Centralized API error codes used across the framework.
 * Keep this file read-only and type-safe.
 */

export const API_ERROR_CODES = {
  // ===== Authentication & Authorization =====
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  TOKEN_EXPIRED: 419,

  // ===== Success Codes =====
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,

  // ===== Client Errors =====
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  CONFLICT: 409,
  VALIDATION_FAILED: 422,

  // ===== Rate Limiting =====
  TOO_MANY_REQUESTS: 429,

  // ===== Server Errors =====
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;
