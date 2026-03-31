import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:npg_4C3KBkrDTsAS@ep-sparkling-king-aemj013n-pooler.c-2.us-east-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require",
});

const db = drizzle(pool, { schema });

export { db };
