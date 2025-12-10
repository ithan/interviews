import { getTranslatedContent } from "../db/queries/mod.ts";
import { successResponse, errorResponse, json } from "../utils/mod.ts";
import { LANGUAGES, type Language } from "../types/mod.ts";

/**
 * Handle GET /api/v1/translations/content/:postId/:language
 */
export function handleGetTranslatedContent(postId: number, language: string): Response {
  // Validate language
  if (!LANGUAGES.includes(language as Language)) {
    return json(
      errorResponse("INVALID_LANGUAGE", `Invalid language: ${language}. Valid languages: ${LANGUAGES.join(", ")}`),
      400
    );
  }

  const content = getTranslatedContent(postId, language as Language);

  if (!content) {
    return json(
      errorResponse("NOT_FOUND", `Translated content for post ${postId} in language ${language} not found`),
      404
    );
  }

  return json(successResponse(content));
}

