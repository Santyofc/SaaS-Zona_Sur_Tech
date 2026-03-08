import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Fail-fast: refuse to start if DATABASE_URL is not explicitly set.
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error(
    "[FATAL] DATABASE_URL environment variable is not set. " +
      "Set it in your .env file or deployment secrets. " +
      "Refusing to start to prevent silent data loss.",
  );
}

/**
 * Lazy singleton: the Postgres client is created once per Node.js process.
 * Using a module-level variable ensures connection pooling works correctly
 * in long-running server processes, while still being safe for Next.js
 * which creates fresh module instances per compilation.
 */
const client = postgres(connectionString, {
  max: 10, // connection pool size
  idle_timeout: 20, // close idle connections after 20s
  connect_timeout: 10, // fail fast on bad config
});

export const db = drizzle(client, { schema });

export * from "./schema";
export * from "drizzle-orm";
