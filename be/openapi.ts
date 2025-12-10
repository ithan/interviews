/**
 * OpenAPI 3.0 specification for the Blog API
 */
export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Blog API",
    description: `
A multilingual blog API with simple HTML content.

## API flow

1. **List posts** - Get paginated posts with available translations
2. **Get post meta** - Get detailed metadata including all available translations  
3. **Get translated content** - Get title and HTML content for a specific language

## Data structure

- 200 posts (10 pages × 20 posts/page)
- 3-6 translations per post
- Simple HTML content (paragraphs, headings, lists only)

## HTML content

The HTML content uses only these tags for easy transformation to JSON blocks:
- \`<p>\` - paragraphs
- \`<h2>\`, \`<h3>\` - headings
- \`<ul>\` / \`<li>\` - lists
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
    { name: "Content", description: "Translated content retrieval" },
  ],
  paths: {
    "/api/v1/posts": {
      get: {
        tags: ["Posts"],
        summary: "List all posts",
        description: "Returns paginated list of posts with available translations.",
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
        description: "Returns post metadata including all available translations with their titles.",
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
            description: "Post metadata with available translations",
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
    "/api/v1/translations/content/{postId}/{language}": {
      get: {
        tags: ["Content"],
        summary: "Get translated content",
        description: "Returns title and HTML content for a specific language.",
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
            description: "Translated content with title",
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
            description: "Translation not found",
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
      TranslationInfo: {
        type: "object",
        properties: {
          language: { $ref: "#/components/schemas/Language" },
          post_id: { type: "integer" },
          title: { type: "string" },
          translation_status: { type: "string", enum: ["complete", "partial", "machine"] },
        },
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
          category_ids: { type: "array", items: { type: "integer" } },
          featured_image_id: { type: "integer", nullable: true },
          default_language: { $ref: "#/components/schemas/Language" },
          available_translations: {
            type: "array",
            items: { $ref: "#/components/schemas/TranslationInfo" },
          },
        },
      },
      TranslatedContent: {
        type: "object",
        properties: {
          post_id: { type: "integer" },
          language: { $ref: "#/components/schemas/Language" },
          title: { type: "string" },
          html_content: { type: "string", description: "Simple HTML with p, h2, h3, ul/li tags" },
          excerpt: { type: "string", nullable: true },
          word_count: { type: "integer" },
          translation_status: { type: "string", enum: ["complete", "partial", "machine"] },
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
