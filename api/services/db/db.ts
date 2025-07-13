import { Kysely, PostgresDialect } from "kysely";
import pg from "pg";

import type { DB } from "@youwise/shared"; // this is the Database interface we defined earlier

export type Database = Kysely<DB>;

export function createDatabase(params: {
  database: string;
  host: string;
  user: string;
  password: string;
  port: number;
}) {
  const { Pool } = pg;

  const dialect = new PostgresDialect({
    pool: new Pool({
      database: params.database,
      host: params.host,
      user: params.user,
      password: params.password,
      port: params.port,
      max: 10,
    }),
  });

  // Database interface is passed to Kysely's constructor, and from now on, Kysely
  // knows your database structure.
  // Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
  // to communicate with your database.
  return new Kysely<DB>({
    dialect,
  });
}
