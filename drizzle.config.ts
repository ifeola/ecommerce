import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/database/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    database: process.env.DB_DATABASE!,
    host: process.env.DB_HOST!,
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    port: Number(process.env.DB_PORT)!,
    ssl: false,
  },
  verbose: true,
  strict: true,
});
