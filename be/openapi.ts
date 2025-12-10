/**
 * OpenAPI 3.0 specification for the Blog API
 */
export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Nightmare WordPress Blog API",
    description: `
A deliberately over-complicated blog API that simulates a legacy WordPress database structure.

## The Challenge

This API requires multiple calls to get complete blog post data:

1. **Get Post Meta** - Returns basic metadata but NOT content
2. **Get Content** - Returns HTML content but NOT title
3. **Get Translation Group** - Returns titles for all languages
4. **Get Translated Content** - Returns translated HTML for each language

## Data Structure

- 200 posts total (10 pages × 20 posts/page)
- Multiple translations per post
- Simple HTML content (paragraphs, headings, lists only)

## Your Task

Build a transformer that converts the HTML content to JSON blocks format.
    `,
    version: "1.0.0",
  },
  servers: [
    {
      url: "http://localhost:8000",
      description: "Local development server",
    },
  ],
  tags: [
    { name: "Posts", description: "Post listing and metadata" },
    { name: "Content", description: "Post content retrieval" },
    { name: "Translations", description: "Translation management" },
  ],
  paths: {
    "/api/v1/posts": {
      get: {
        tags: ["Posts"],
        summary: "List all posts",
        description: "Returns paginated list of post metadata. Default 20 posts per page.",
        parameters: [
          {
            name: "page",
            in: "query",
            description: "Page number (1-indexed)",
            schema: { type: "integer", default: 1, minimum: 1 },
          },
          {
            name: "per_page",
            in: "query",
            description: "Number of posts per page",
            schema: { type: "integer", default: 20, minimum: 1, maximum: 100 },
          },
        ],
        responses: {
          "200": {
            description: "Paginated list of posts",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/PaginatedPostMeta" },
              },
            },
          },
        },
      },
    },
    "/api/v1/post-meta/{id}": {
      get: {
        tags: ["Posts"],
        summary: "Get post metadata",
        description: "Returns post metadata including content_reference_id and translation_group_id needed for other endpoints.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Post ID",
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": {
            description: "Post metadata",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiResponsePostMeta" },
              },
            },
          },
          "404": {
            description: "Post not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
              },
            },
          },
        },
      },
    },
    "/api/v1/content/{referenceId}": {
      get: {
        tags: ["Content"],
        summary: "Get post content",
        description: "Returns the HTML content for a post. Use content_reference_id from post-meta.",
        parameters: [
          {
            name: "referenceId",
            in: "path",
            required: true,
            description: "Content reference ID (UUID from post-meta)",
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "Post content",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiResponsePostContent" },
              },
            },
          },
          "404": {
            description: "Content not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
              },
            },
          },
        },
      },
    },
    "/api/v1/translations/group/{groupId}": {
      get: {
        tags: ["Translations"],
        summary: "Get translation group",
        description: "Returns all translations for a post including titles. Use translation_group_id from post-meta.",
        parameters: [
          {
            name: "groupId",
            in: "path",
            required: true,
            description: "Translation group ID (UUID from post-meta)",
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": {
            description: "Translation group",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiResponseTranslationGroup" },
              },
            },
          },
          "404": {
            description: "Translation group not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
              },
            },
          },
        },
      },
    },
    "/api/v1/translations/content/{postId}/{language}": {
      get: {
        tags: ["Translations"],
        summary: "Get translated content",
        description: "Returns the translated HTML content for a specific language.",
        parameters: [
          {
            name: "postId",
            in: "path",
            required: true,
            description: "Post ID",
            schema: { type: "integer" },
          },
          {
            name: "language",
            in: "path",
            required: true,
            description: "Language code",
            schema: { type: "string", enum: ["en", "fr", "de", "es", "it", "cs", "pl", "jp"] },
          },
        ],
        responses: {
          "200": {
            description: "Translated content",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiResponseTranslatedContent" },
              },
            },
          },
          "400": {
            description: "Invalid language",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
              },
            },
          },
          "404": {
            description: "Translated content not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Language: {
        type: "string",
        enum: ["en", "fr", "de", "es", "it", "cs", "pl", "jp"],
      },
      PostMeta: {
        type: "object",
        properties: {
          id: { type: "integer" },
          slug: { type: "string" },
          author_id: { type: "integer" },
          status: { type: "string", enum: ["published", "draft", "archived"] },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
          content_reference_id: { type: "string", format: "uuid" },
          translation_group_id: { type: "string", format: "uuid" },
          category_ids: { type: "array", items: { type: "integer" } },
          featured_image_id: { type: "integer", nullable: true },
        },
      },
      PostContent: {
        type: "object",
        properties: {
          reference_id: { type: "string", format: "uuid" },
          html_body: { type: "string", description: "Simple HTML with p, h2-h4, ul/li tags" },
          excerpt: { type: "string", nullable: true },
          word_count: { type: "integer" },
          last_modified: { type: "string", format: "date-time" },
          revision_number: { type: "integer" },
        },
      },
      TranslationGroup: {
        type: "object",
        properties: {
          group_id: { type: "string", format: "uuid" },
          default_language: { $ref: "#/components/schemas/Language" },
          translations: {
            type: "object",
            additionalProperties: {
              type: "object",
              properties: {
                post_id: { type: "integer" },
                title: { type: "string" },
                meta_description: { type: "string", nullable: true },
                locale_specific_slug: { type: "string", nullable: true },
                translation_status: { type: "string", enum: ["complete", "partial", "machine", "missing"] },
                translated_by: { type: "string", nullable: true },
                translated_at: { type: "string", format: "date-time", nullable: true },
              },
            },
          },
        },
      },
      TranslatedContent: {
        type: "object",
        properties: {
          post_id: { type: "integer" },
          language: { $ref: "#/components/schemas/Language" },
          translated_html: { type: "string" },
          translation_quality_score: { type: "number", nullable: true },
          uses_fallback: { type: "boolean" },
        },
      },
      ApiMeta: {
        type: "object",
        properties: {
          timestamp: { type: "string", format: "date-time" },
          request_id: { type: "string", format: "uuid" },
        },
      },
      ApiError: {
        type: "object",
        properties: {
          success: { type: "boolean", enum: [false] },
          error: {
            type: "object",
            properties: {
              code: { type: "string" },
              message: { type: "string" },
              details: {},
            },
          },
          meta: { $ref: "#/components/schemas/ApiMeta" },
        },
      },
      ApiResponsePostMeta: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          data: { $ref: "#/components/schemas/PostMeta" },
          meta: { $ref: "#/components/schemas/ApiMeta" },
        },
      },
      ApiResponsePostContent: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          data: { $ref: "#/components/schemas/PostContent" },
          meta: { $ref: "#/components/schemas/ApiMeta" },
        },
      },
      ApiResponseTranslationGroup: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          data: { $ref: "#/components/schemas/TranslationGroup" },
          meta: { $ref: "#/components/schemas/ApiMeta" },
        },
      },
      ApiResponseTranslatedContent: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          data: { $ref: "#/components/schemas/TranslatedContent" },
          meta: { $ref: "#/components/schemas/ApiMeta" },
        },
      },
      PaginatedPostMeta: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          data: { type: "array", items: { $ref: "#/components/schemas/PostMeta" } },
          pagination: {
            type: "object",
            properties: {
              page: { type: "integer" },
              per_page: { type: "integer" },
              total: { type: "integer" },
              total_pages: { type: "integer" },
            },
          },
          meta: { $ref: "#/components/schemas/ApiMeta" },
        },
      },
    },
  },
};

