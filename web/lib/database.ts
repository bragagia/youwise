import { DB } from "@/database.d";
import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";

let db: Kysely<DB> | null = null;

export function getDatabase(): Kysely<DB> {
  if (!db) {
    const dialect = new PostgresDialect({
      pool: new Pool({
        database: process.env.DB_NAME || "youwise",
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "postgres",
        password: process.env.DB_PASSWORD || "postgres",
        port: Number(process.env.DB_PORT) || 5432,
        max: 10,
      }),
    });
    db = new Kysely<DB>({ dialect });
  }
  return db;
}
