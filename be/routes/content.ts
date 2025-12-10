import { getContentByRefId } from "../db/queries/mod.ts";
import { successResponse, errorResponse, json } from "../utils/mod.ts";

/**
 * Handle GET /api/v1/content/:referenceId
 */
export function handleGetContent(referenceId: string): Response {
  const content = getContentByRefId(referenceId);

  if (!content) {
    return json(
      errorResponse("NOT_FOUND", `Content with reference_id ${referenceId} not found`),
      404
    );
  }

  return json(successResponse(content));
}

