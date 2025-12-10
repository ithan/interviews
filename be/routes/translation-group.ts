import { getTranslationGroupById } from "../db/queries/mod.ts";
import { successResponse, errorResponse, json } from "../utils/mod.ts";

/**
 * Handle GET /api/v1/translations/group/:groupId
 */
export function handleGetTranslationGroup(groupId: string): Response {
  const group = getTranslationGroupById(groupId);

  if (!group) {
    return json(
      errorResponse("NOT_FOUND", `Translation group with id ${groupId} not found`),
      404
    );
  }

  return json(successResponse(group));
}

