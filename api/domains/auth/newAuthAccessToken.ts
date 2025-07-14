import { Services } from "@/main/envs/type.js";
import { BadRequestError } from "@/utils/errors.js";

export async function newAuthAccessToken(
  srv: Services,
  refreshToken: string
): Promise<string> {
  const refreshTokenDecoded = srv.jwt.validateRefreshToken(refreshToken);

  if (!refreshTokenDecoded.userId) {
    throw new BadRequestError(
      "Cannot decode refreshtoken: " + refreshTokenDecoded.error
    );
  }

  // We double check that the user is valid (should check if not removed/deactivated in the future)
  const userResponse = await srv.db
    .selectFrom("users")
    .selectAll()
    .where("id", "=", refreshTokenDecoded.userId)
    .executeTakeFirst();

  if (!userResponse) {
    throw new BadRequestError("User not found for the provided refresh token");
  }

  const accessToken = srv.jwt.generateAccessToken(refreshTokenDecoded.userId);

  return accessToken;
}
