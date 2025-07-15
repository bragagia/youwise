import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  // Add published_at field to resources table
  await db.schema
    .alterTable("resources")
    .addColumn("published_at", "timestamp", (col) => col)
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  // Remove published_at field from resources table
  await db.schema
    .alterTable("resources")
    .dropColumn("published_at")
    .execute();
}