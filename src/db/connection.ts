import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema.js";

console.log("DATABASE URL: ", process.env.DB_URL);

if (!process.env.DB_URL) {
  throw new Error("DB_URL is not defined");
}

const pool = new Pool({
  connectionString: process.env.DB_URL,
});

const db = drizzle(pool, { schema });

export { db };
