import { eq, ilike } from "drizzle-orm";
import { db } from "../index.ts";
import { userTable } from "../schema/user.ts";

export type SelectUser = typeof userTable.$inferSelect;

export async function getUserById(id: string) {
  const [user] = await db.select().from(userTable).where(eq(userTable.id, id));
  return user;
}

export async function getUserByUsername(username: string) {
  const [user] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.username, username));
  return user;
}

export async function getUserByEmail(email: string) {
  const [user] = await db
    .select()
    .from(userTable)
    .where(ilike(userTable.email, email));
  return user;
}
