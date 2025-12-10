/**
 * Available languages in the system
 */
export type Language = "en" | "fr" | "de" | "es" | "it" | "cs" | "pl" | "jp";

export const LANGUAGES: Language[] = ["en", "fr", "de", "es", "it", "cs", "pl", "jp"];

/**
 * POST META ENDPOINT: /api/v1/post-meta/{id}
 */
export interface PostMeta {
  id: number;
  slug: string;
  author_id: number;
  status: "published" | "draft" | "archived";
  created_at: string;
  updated_at: string;
  content_reference_id: string;
  translation_group_id: string;
  category_ids: number[];
  featured_image_id?: number;
}

/**
 * CONTENT ENDPOINT: /api/v1/content/{content_reference_id}
 */
export interface PostContent {
  reference_id: string;
  html_body: string;
  excerpt?: string;
  word_count: number;
  last_modified: string;
  revision_number: number;
}

/**
 * TRANSLATION GROUP ENDPOINT: /api/v1/translations/group/{translation_group_id}
 */
export interface TranslationGroup {
  group_id: string;
  default_language: Language;
  translations: {
    [K in Language]?: {
      post_id: number;
      title: string;
      meta_description?: string;
      locale_specific_slug?: string;
      translation_status: "complete" | "partial" | "machine" | "missing";
      translated_by?: string;
      translated_at?: string;
    };
  };
}

/**
 * TRANSLATION CONTENT ENDPOINT: /api/v1/translations/content/{post_id}/{language}
 */
export interface TranslatedContent {
  post_id: number;
  language: Language;
  translated_html: string;
  translation_quality_score?: number;
  uses_fallback: boolean;
}

/**
 * API Response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta: {
    timestamp: string;
    request_id: string;
  };
}

/**
 * API Error response
 */
export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta: {
    timestamp: string;
    request_id: string;
  };
}

/**
 * Paginated list response
 */
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
  meta: {
    timestamp: string;
    request_id: string;
  };
}

