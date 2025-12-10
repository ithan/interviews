# Build stage
FROM denoland/deno:latest AS builder

WORKDIR /app

# Copy dependency files first for better caching
COPY deno.json .

# Cache dependencies
RUN deno install

# Copy source files
COPY . .

# Cache the main application and seed script
RUN deno cache server.ts scripts/seed.ts

# Pre-download SQLite native library by importing it
RUN deno eval "import { Database } from '@db/sqlite';" --allow-net --allow-read --allow-write --allow-env --allow-ffi || true

# Production stage
FROM denoland/deno:latest

WORKDIR /app

# Create data directory with correct permissions
RUN mkdir -p /app/data && chown deno:deno /app/data

# Copy from builder (deno user already exists in the base image)
COPY --from=builder --chown=deno:deno /app .
COPY --from=builder --chown=deno:deno /deno-dir /deno-dir

# Make entrypoint executable
RUN chmod +x /app/entrypoint.sh

# Switch to non-root user (already exists in deno image)
USER deno

# Expose port (configurable via env)
EXPOSE 8000

# Health check (with longer start period for seeding)
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD deno eval "const r = await fetch('http://localhost:' + (Deno.env.get('BE_PORT') || '8000') + '/api/v1/posts?page=1&per_page=1'); if (!r.ok) Deno.exit(1);"

# Use entrypoint script to auto-seed if needed
ENTRYPOINT ["/app/entrypoint.sh"]

