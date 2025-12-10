import {
  handleGetPostMeta,
  handleGetTranslatedContent,
  handleListPosts,
} from "./routes/mod.ts";
import { errorResponse, json } from "./utils/mod.ts";
import { openApiSpec } from "./openapi.ts";
import { closeDb } from "./db/mod.ts";

const PORT = parseInt(Deno.env.get("BE_PORT") ?? "8000", 10);

/**
 * Simple router
 */
function router(req: Request): Response {
  const url = new URL(req.url);
  const path = url.pathname;

  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  // Only GET requests allowed
  if (req.method !== "GET") {
    return json(errorResponse("METHOD_NOT_ALLOWED", "Only GET requests are allowed"), 405);
  }

  // Documentation endpoints
  if (path === "/" || path === "/docs") {
    return new Response(getDocsHtml(), {
      headers: { "Content-Type": "text/html" },
    });
  }

  if (path === "/openapi.json") {
    return json(openApiSpec);
  }

  // API routes
  // GET /api/v1/posts
  if (path === "/api/v1/posts") {
    return handleListPosts(url);
  }

  // GET /api/v1/post-meta/:id
  const postMetaMatch = path.match(/^\/api\/v1\/post-meta\/(\d+)$/);
  if (postMetaMatch) {
    const id = parseInt(postMetaMatch[1], 10);
    return handleGetPostMeta(id);
  }

  // GET /api/v1/translations/content/:postId/:language
  const translatedContentMatch = path.match(/^\/api\/v1\/translations\/content\/(\d+)\/(\w+)$/);
  if (translatedContentMatch) {
    const postId = parseInt(translatedContentMatch[1], 10);
    const language = translatedContentMatch[2];
    return handleGetTranslatedContent(postId, language);
  }

  // 404
  return json(errorResponse("NOT_FOUND", `Endpoint ${path} not found`), 404);
}

/**
 * Generate documentation HTML
 */
function getDocsHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Blog API</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css">
  <style>
    body { margin: 0; padding: 0; }
    .swagger-ui .topbar { display: none; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>
    SwaggerUIBundle({
      url: '/openapi.json',
      dom_id: '#swagger-ui',
      presets: [SwaggerUIBundle.presets.apis, SwaggerUIBundle.SwaggerUIStandalonePreset],
      layout: 'BaseLayout'
    });
  </script>
</body>
</html>`;
}

/**
 * Main handler
 */
function handler(req: Request): Response {
  try {
    return router(req);
  } catch (error) {
    console.error("Server error:", error);
    return json(
      errorResponse("INTERNAL_ERROR", "An internal server error occurred"),
      500
    );
  }
}

// Start server
console.log(`
╔══════════════════════════════════════════════════════════════╗
║              🌐 Blog API Server                              ║
╠══════════════════════════════════════════════════════════════╣
║  Server running at: http://localhost:${PORT}                    ║
║  API Documentation: http://localhost:${PORT}/docs               ║
╠══════════════════════════════════════════════════════════════╣
║  Endpoints:                                                  ║
║  ────────────────────────────────────────────────────────────║
║  GET /api/v1/posts                   List posts (paginated)  ║
║  GET /api/v1/post-meta/:id           Get post + translations ║
║  GET /api/v1/translations/content/:id/:lang  Get content     ║
╚══════════════════════════════════════════════════════════════╝
`);

// Handle shutdown gracefully
Deno.addSignalListener("SIGINT", () => {
  console.log("\n👋 Shutting down...");
  closeDb();
  Deno.exit(0);
});

Deno.serve({ port: PORT }, handler);
