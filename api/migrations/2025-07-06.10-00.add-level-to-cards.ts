import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  // Create card_level enum type
  await sql`CREATE TYPE card_level AS ENUM ('core_concept', 'knowledge', 'example')`.execute(
    db
  );

  // Add level field to cards table using the enum type
  await db.schema
    .alterTable("cards")
    .addColumn("level", sql`card_level`, (col) =>
      col.notNull().defaultTo(sql`'knowledge'::card_level`)
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  // Remove level field from cards table
  await db.schema.alterTable("cards").dropColumn("level").execute();

  // Drop the enum type
  await sql`DROP TYPE card_level`.execute(db);
}
