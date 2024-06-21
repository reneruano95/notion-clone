import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

config({ path: ".env" });
if (!process.env.SUPABASE_URL) {
  console.log("🔴 Cannot find supabase url");
}
const connectionString = process.env.DATABASE_URL;

const client = postgres(connectionString as string);
const db = drizzle(client);

export default db;
