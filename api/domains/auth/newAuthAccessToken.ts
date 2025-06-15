import { Services } from "../../main/envs/type.js";
import { UserAuthed, UserExpiredAuth } from "../../utils/auth.js";
import { BadRequestError, UnauthorizedError } from "../../utils/errors.js";

export async function newAuthAccessToken(
  srv: Services,
  auth: UserExpiredAuth | UserAuthed,
  refreshToken: string
): Promise<string> {
  const refreshTokenDecoded = srv.jwt.validateRefreshToken(refreshToken);
  if (!refreshTokenDecoded.userId) {
    throw new UnauthorizedError(refreshTokenDecoded.error);
  }
  if (auth.userId !== refreshTokenDecoded.userId) {
    throw new BadRequestError("Invalid refresh token, userId mismatch");
  }

  const accessToken = srv.jwt.generateAccessToken(auth.userId);

  return accessToken;
}
