import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as userRepository from "./repository/user.ts";

const key = "DATABASE_URL";
if (!process.env[key])
  throw new Error("Invalid environment variables", {
    cause: { [key]: ["Required"] },
  });

export const pool = new pg.Pool({ connectionString: process.env[key] });

export const db = drizzle({ client: pool });

export const repository = {
  ...userRepository,
};
