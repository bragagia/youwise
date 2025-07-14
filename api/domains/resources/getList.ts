import { Services } from "@/main/envs/type.js";
import { UserAuthed } from "@/utils/auth.js";

export async function getResourcesList(srv: Services, _auth: UserAuthed) {
  const resources = await srv.db
    .selectFrom("resources")
    .select(["id", "cover", "name"])
    .execute();

  return resources;
}
