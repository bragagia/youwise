import type { DB } from "@youwise/shared";
import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";

export const dialect = new PostgresDialect({
  pool: new Pool({
    database: "postgres_v2",
    host: "localhost",
    user: "postgres",
    password: "postgres",
    port: 5432,
    max: 10,
  }),
});

export const db = new Kysely<DB>({
  dialect,
});
