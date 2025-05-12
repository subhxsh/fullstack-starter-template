import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL)
  throw new Error("Environment variable 'DATABASE_URL' not set");

export default defineConfig({
  out: "./migrations",
  schema: "./src/schema",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
