import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { envServer } from "../env.ts";

export const pool = new pg.Pool({ connectionString: envServer.DATABASE_URL });
export const db = drizzle({ client: pool });
