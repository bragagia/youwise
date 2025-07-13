import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  // Add intro and short_description fields to resources table
  await db.schema
    .alterTable("resources")
    .addColumn("intro", "text", (col) => col.notNull().defaultTo(""))
    .addColumn("short_description", "text", (col) => col.notNull().defaultTo(""))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  // Remove intro and short_description fields from resources table
  await db.schema
    .alterTable("resources")
    .dropColumn("intro")
    .dropColumn("short_description")
    .execute();
}