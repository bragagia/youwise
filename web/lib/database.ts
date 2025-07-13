import { DatabaseUsers } from "@/lib/db/users";
import { DatabaseResources } from "@/lib/db/resources";
import { DatabaseCards } from "@/lib/db/cards";
import { DB } from "@youwise/shared";
import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";

function getDatabaseWrapper() {
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
  const rawDb = new Kysely<DB>({ dialect });

  return {
    rawDb: rawDb,
    users: new DatabaseUsers(rawDb),
    resources: new DatabaseResources(rawDb),
    cards: new DatabaseCards(rawDb),
  };
}

export async function getServices() {
  const db = getDatabaseWrapper();

  return {
    db,
  };
}
