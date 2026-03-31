import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://neondb_owner:npg_4C3KBkrDTsAS@ep-sparkling-king-aemj013n-pooler.c-2.us-east-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require",
  },
});
