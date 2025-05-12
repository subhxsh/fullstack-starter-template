import { envServer } from "../env.ts";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as userRepository from "./repository/user.ts";

export const pool = new pg.Pool({ connectionString: envServer.DATABASE_URL });

export const db = drizzle({ client: pool });

export const repository = {
  ...userRepository,
};
