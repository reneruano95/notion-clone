import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env" });

if (!process.env.DATABASE_URL) {
  throw new Error("🔴 Cannot find database url");
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./lib/supabase/schema.ts",
  out: "./migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL || "", // Supabase url from .env
  },
});
