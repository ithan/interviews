import { getPostMetaById } from "../db/queries/mod.ts";
import { successResponse, errorResponse, json } from "../utils/mod.ts";

/**
 * Handle GET /api/v1/post-meta/:id
 */
export function handleGetPostMeta(id: number): Response {
  const postMeta = getPostMetaById(id);

  if (!postMeta) {
    return json(
      errorResponse("NOT_FOUND", `Post with id ${id} not found`),
      404
    );
  }

  return json(successResponse(postMeta));
}

