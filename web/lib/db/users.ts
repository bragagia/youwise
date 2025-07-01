"use server";

import { getDatabase } from "@/lib/database";

export async function getUsers() {
  const database = getDatabase();
  return await database
    .selectFrom("users")
    .selectAll()
    .orderBy("created_at", "desc")
    .execute();
}
