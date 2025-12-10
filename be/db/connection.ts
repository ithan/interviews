import { Database } from "@db/sqlite";

let db: Database | null = null;

/**
 * Get the database file path from environment or default
 */
export function getDbPath(): string {
  return Deno.env.get("DB_PATH") ?? "blog.db";
}

/**
 * Get or create the database connection
 */
export function getDb(): Database {
  if (!db) {
    db = new Database(getDbPath());
  }
  return db;
}

/**
 * Close the database connection
 */
export function closeDb(): void {
  if (db) {
    db.close();
    db = null;
  }
}

