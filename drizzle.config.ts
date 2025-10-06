import { defineConfig } from "drizzle-kit";

// Optional database URL - project uses in-memory storage by default
const databaseUrl = process.env.DATABASE_URL || "postgresql://localhost:5432/temp";

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
});
