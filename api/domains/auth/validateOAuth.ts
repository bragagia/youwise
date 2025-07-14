import { Services } from "@/main/envs/type.js";
import { BadRequestError } from "@/utils/errors.js";
import type { UserModel } from "@youwise/shared";
import { Updateable } from "kysely";

type UserInfoOAuth = {
  email: string;
  emailVerified: boolean;
  picture?: string;
  firstName: string;
  familyName?: string;
} & (
  | {
      type: "apple";
      appleUid: string;
    }
  | {
      type: "google";
      googleUid: string;
    }
);

type OAuthInput =
  | {
      type: "google";
      googleToken: string;
    }
  | {
      type: "apple";
      appleToken: string;
    };

export async function validateOAuth(srv: Services, oauth: OAuthInput) {
  let userInfo: UserInfoOAuth;

  if (oauth.type === "google") {
    userInfo = await srv.googleAuth.validateGoogleAuth(oauth);
  } else {
    // if (oauth.type === "apple")
    throw new BadRequestError("Apple login is not supported yet");
  }

  // Check if user already exists
  let existingUser: UserModel | undefined;
  if (userInfo.type === "google") {
    existingUser = await srv.db
      .selectFrom("users")
      .selectAll()
      .where("google_uid", "=", userInfo.googleUid)
      .executeTakeFirst();
  } else {
    throw new BadRequestError("Apple login is not supported yet");
  }

  // If can't find user by oauth uid, try to find by email
  if (!existingUser) {
    existingUser = await srv.db
      .selectFrom("users")
      .selectAll()
      .where("email", "=", userInfo.email)
      .executeTakeFirst();

    // Update user to add new login method
    if (existingUser) {
      let userUpdate: Updateable<UserModel>;

      if (userInfo.type === "google") {
        userUpdate = {
          google_uid: userInfo.googleUid,
        };
        existingUser.google_uid = userInfo.googleUid;
      } else {
        throw new BadRequestError("Apple login is not supported yet");
      }

      await srv.db
        .updateTable("users")
        .set(userUpdate)
        .where("id", "=", existingUser.id)
        .execute();
    }
  }

  let user: UserModel;
  // Create user if not exists
  if (existingUser) {
    user = existingUser;
  } else {
    user = await srv.db
      .insertInto("users")
      .values({
        email: userInfo.email,
        given_name: userInfo.firstName,
        family_name: userInfo.familyName,
        google_uid: userInfo.type === "google" ? userInfo.googleUid : null,
        // apple_uid: userInfo.type === "apple" ? userInfo.appleUid : null,
      })
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  return {
    refreshToken: srv.jwt.generateRefreshToken(user.id),
    accessToken: srv.jwt.generateAccessToken(user.id),
    user: user,
  };
}
