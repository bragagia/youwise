import { Services } from "../../main/envs/type.js";
import { UserAuthed } from "../../utils/auth.js";
import { NotFoundError } from "../../utils/errors.js";

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

// export async function createUser(
//   srv: Services,
//   user: {
//     email: string;
//     givenName: string;
//   }
// ) {
//   const ret = await srv.db
//     .insertInto("users")
//     .values({
//       email: user.email,
//       given_name: user.givenName,
//     })
//     .executeTakeFirstOrThrow();

//   return ret.insertId;
// }
