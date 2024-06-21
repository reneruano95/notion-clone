import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

config({ path: ".env" });
if (!process.env.DATABASE_URL) {
  console.log("🔴 No database url");
}
const connectionString = process.env.DATABASE_URL || "";

const client = postgres(connectionString, { max: 1 });
const db = drizzle(client);
const migrateDb = async () => {
  try {
    console.log("🔵 Migrating client");

    await migrate(db, { migrationsFolder: "migrations" });

    console.log("🟢 Successfully migrated client");
  } catch (error) {
    console.log("🔴 Failed to migrate client,", error);
  }
};

migrateDb();

export default db;
