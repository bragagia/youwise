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
  // --- Trigger Function for updated_at ---
  await sql`
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
       NEW.updated_at = CURRENT_TIMESTAMP;
       RETURN NEW;
    END;
    $$ language 'plpgsql';
  `.execute(db);

  // --- Enum Type ---
  await db.schema
    .createType("FsrsStateEnum")
    .asEnum(["Learning", "Review", "Relearning"])
    .execute();

  // --- Table Creation ---

  // Create users table
  await db.schema
    .createTable("users")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn("created_at", "timestamptz", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    // updated_at: default set by trigger, but needs to be NOT NULL if required
    .addColumn("updated_at", "timestamptz", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .addColumn("google_uid", "text", (col) => col.unique())
    .addColumn("apple_uid", "text", (col) => col.unique())
    .addColumn("given_name", "text", (col) => col.notNull())
    .addColumn("family_name", "text")
    .addColumn("email", "text", (col) => col.unique().notNull())
    .execute();
  // Apply the trigger to users table
  await createUpdatedAtTrigger("users").execute(db);

  // Create resources table
  await db.schema
    .createTable("resources")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn("created_at", "timestamptz", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .addColumn("updated_at", "timestamptz", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("tint", "integer", (col) => col.defaultTo(0).notNull())
    .addColumn("description", "text", (col) => col.notNull())
    .execute();
  // Apply the trigger to resources table
  await createUpdatedAtTrigger("resources").execute(db);

  // Create cards table
  await db.schema
    .createTable("cards")
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
    .addColumn("variants", "jsonb", (col) => col.notNull())
    .execute();
  // Apply the trigger to cards table
  await createUpdatedAtTrigger("cards").execute(db);

  // Create memories table
  await db.schema
    .createTable("memories")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn("created_at", "timestamptz", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .addColumn("updated_at", "timestamptz", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .addColumn("owner_user_id", "uuid", (col) =>
      col.references("users.id").onDelete("cascade").notNull()
    )
    .addColumn("card_id", "uuid", (col) =>
      col.references("cards.id").onDelete("cascade").notNull()
    )
    .addUniqueConstraint("memories_owner_user_id_card_id_unique", [
      "owner_user_id",
      "card_id",
    ])
    .execute();
  // Apply the trigger to memories table
  await createUpdatedAtTrigger("memories").execute(db);

  // Create memory_params table
  await db.schema
    .createTable("memory_params")
    .addColumn("memory_id", "uuid", (col) =>
      col.primaryKey().references("memories.id").onDelete("cascade")
    )
    .addColumn("created_at", "timestamptz", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .addColumn("updated_at", "timestamptz", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .addColumn("due_easy", "timestamptz", (col) => col.notNull())
    .addColumn("due_normal", "timestamptz", (col) => col.notNull())
    .addColumn("due_hard", "timestamptz", (col) => col.notNull())
    .addColumn("due_harder", "timestamptz", (col) => col.notNull())
    .addColumn("fsrs_state", sql`"FsrsStateEnum"`, (col) => col.notNull())
    .addColumn("fsrs_stability", "double precision", (col) => col.notNull())
    .addColumn("fsrs_difficulty", "double precision", (col) => col.notNull())
    .addColumn("fsrs_elapsed_days", "integer", (col) => col.notNull())
    .addColumn("fsrs_scheduled_days", "integer", (col) => col.notNull())
    .addColumn("fsrs_reps", "integer", (col) => col.notNull())
    .addColumn("fsrs_lapses", "integer", (col) => col.notNull())
    .addColumn("fsrs_last_review", "timestamptz")
    .execute();
  await createUpdatedAtTrigger("memory_params").execute(db);

  // Create daily_revisions table
  await db.schema
    .createTable("daily_revisions")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn("created_at", "timestamptz", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .addColumn("updated_at", "timestamptz", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .addColumn("owner_user_id", "uuid", (col) =>
      col.references("users.id").onDelete("cascade").notNull()
    )
    .addColumn("date", "date", (col) => col.notNull())
    .addUniqueConstraint("daily_revisions_owner_user_id_date_unique", [
      "owner_user_id",
      "date",
    ])
    .execute();
  await createUpdatedAtTrigger("daily_revisions").execute(db);

  // Create memories_on_daily_revisions (join table)
  await db.schema
    .createTable("memories_on_daily_revisions")
    .addColumn("memory_id", "uuid", (col) =>
      col.references("memories.id").onDelete("cascade").notNull()
    )
    .addColumn("created_at", "timestamptz", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .addColumn("updated_at", "timestamptz", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .addColumn("daily_revisions_id", "uuid", (col) =>
      col.references("daily_revisions.id").onDelete("cascade").notNull()
    )
    .addPrimaryKeyConstraint("memories_on_daily_revisions_pkey", [
      "memory_id",
      "daily_revisions_id",
    ])
    .execute();
  await createUpdatedAtTrigger("memories_on_daily_revisions").execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  // --- Drop Triggers ---
  // Drop triggers before dropping tables or the function
  await dropUpdatedAtTrigger("users").execute(db);
  await dropUpdatedAtTrigger("resources").execute(db);
  await dropUpdatedAtTrigger("cards").execute(db);
  await dropUpdatedAtTrigger("memories").execute(db);
  await dropUpdatedAtTrigger("memory_params").execute(db);
  await dropUpdatedAtTrigger("daily_revisions").execute(db);
  await dropUpdatedAtTrigger("memories_on_daily_revisions").execute(db);

  // --- Drop Trigger Function ---
  await sql`DROP FUNCTION IF EXISTS update_updated_at_column();`.execute(db);

  // --- Drop Tables (Reverse Order) ---
  await db.schema.dropTable("memories_on_daily_revisions").ifExists().execute();
  await db.schema.dropTable("memory_params").ifExists().execute();
  await db.schema.dropTable("memories").ifExists().execute();
  await db.schema.dropTable("daily_revisions").ifExists().execute();
  await db.schema.dropTable("cards").ifExists().execute();
  await db.schema.dropTable("resources").ifExists().execute();
  await db.schema.dropTable("users").ifExists().execute();

  // --- Drop Enum Type ---
  await db.schema.dropType("FsrsStateEnum").ifExists().execute();
}
