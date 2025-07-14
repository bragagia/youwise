import { Services } from "@/main/envs/type.js";
import { UserAuthed } from "@/utils/auth.js";
import { NotFoundError } from "@/utils/errors.js";

export async function getUserById(
  srv: Services,
  _auth: UserAuthed,
  userId: string
) {
  const user = await srv.db
    .selectFrom("users")
    .selectAll()
    .where("id", "=", userId)
    .executeTakeFirst();
  if (!user) {
    throw new NotFoundError(`User ${userId} not found`);
  }

  return user;
}
