import { Kysely, sql } from "kysely";

/******** HELPER FUNCTIONS FOR UPDATED_AT *******/
const createUpdatedAtTrigger = (tableName: string) => {
  return sql`
    CREATE TRIGGER ${sql.raw(`update_${tableName}_updated_at`)}
    BEFORE UPDATE ON ${sql.table(tableName)}
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `;
};

// Helper function to drop the updated_at trigger for a table
const dropUpdatedAtTrigger = (tableName: string) => {
  return sql`
    DROP TRIGGER IF EXISTS ${sql.raw(
      `update_${tableName}_updated_at`
    )} ON ${sql.table(tableName)};
  `;
};
/******** ------------------------------ *******/

export async function up(db: Kysely<any>): Promise<void> {
  // Add cover field to resources table
  await db.schema
    .alterTable("resources")
    .addColumn("cover", "text", (col) => col.notNull())
    .execute();

  // Create resource_sections table
  await db.schema
    .createTable("resource_sections")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn("created_at", "timestamptz", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .addColumn("updated_at", "timestamptz", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .addColumn("resource_id", "uuid", (col) =>
      col.references("resources.id").onDelete("cascade").notNull()
    )
    .addColumn("title", "text", (col) => col.notNull())
    .addColumn("content", "text", (col) => col.notNull())
    .addColumn("more_content", "text")
    .addColumn("position", "double precision", (col) => col.notNull())
    .execute();

  // Apply the trigger to resource_sections table
  await createUpdatedAtTrigger("resource_sections").execute(db);

  // Update cards table to reference resource_sections instead of resources
  // Drop the resource_id column (this will automatically drop the foreign key constraint)
  await db.schema.alterTable("cards").dropColumn("resource_id").execute();

  // Add the new resource_section_id column
  await db.schema
    .alterTable("cards")
    .addColumn("resource_section_id", "uuid", (col) =>
      col.references("resource_sections.id").onDelete("cascade").notNull()
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  // Drop the resource_section_id column from cards (this will automatically drop the foreign key)
  await db.schema
    .alterTable("cards")
    .dropColumn("resource_section_id")
    .execute();

  // Add back the resource_id column to cards
  await db.schema
    .alterTable("cards")
    .addColumn("resource_id", "uuid", (col) =>
      col.references("resources.id").onDelete("cascade").notNull()
    )
    .execute();

  // Drop resource_sections table and its trigger
  await dropUpdatedAtTrigger("resource_sections").execute(db);
  await db.schema.dropTable("resource_sections").ifExists().execute();

  // Remove cover field from resources table
  await db.schema.alterTable("resources").dropColumn("cover").execute();
}
