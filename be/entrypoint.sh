#!/bin/sh
set -e

DB_PATH="${DB_PATH:-blog.db}"

# Check if database exists, if not seed it
if [ ! -f "$DB_PATH" ]; then
    echo "📦 Database not found at $DB_PATH, seeding..."
    deno run -A scripts/seed.ts
else
    echo "✅ Database found at $DB_PATH"
fi

# Start the server
exec deno run -A server.ts

