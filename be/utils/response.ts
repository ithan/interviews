import type { ApiResponse, ApiError, PaginatedResponse } from "../types/mod.ts";

/**
 * Generate a unique request ID
 */
export function generateRequestId(): string {
  return crypto.randomUUID();
}

/**
 * Create a success response
 */
export function successResponse<T>(data: T, requestId?: string): ApiResponse<T> {
  return {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      request_id: requestId ?? generateRequestId(),
    },
  };
}

/**
 * Create an error response
 */
export function errorResponse(
  code: string,
  message: string,
  details?: unknown,
  requestId?: string
): ApiError {
  return {
    success: false,
    error: {
      code,
      message,
      details,
    },
    meta: {
      timestamp: new Date().toISOString(),
      request_id: requestId ?? generateRequestId(),
    },
  };
}

/**
 * Create a paginated response
 */
export function paginatedResponse<T>(
  data: T[],
  page: number,
  perPage: number,
  total: number,
  requestId?: string
): PaginatedResponse<T> {
  return {
    success: true,
    data,
    pagination: {
      page,
      per_page: perPage,
      total,
      total_pages: Math.ceil(total / perPage),
    },
    meta: {
      timestamp: new Date().toISOString(),
      request_id: requestId ?? generateRequestId(),
    },
  };
}

/**
 * JSON response helper
 */
export function json<T>(data: T, status = 200): Response {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

