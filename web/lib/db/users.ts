import { DB } from "@youwise/shared";
import { Kysely } from "kysely";

export class DatabaseUsers {
  constructor(private db: Kysely<DB>) {}

  async getUsers() {
    return await this.db
      .selectFrom("users")
      .selectAll()
      .orderBy("created_at", "desc")
      .execute();
  }
}
