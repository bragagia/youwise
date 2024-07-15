import { generateAccessToken, validateRefreshToken } from "@/lib/jwt";
import { ErrorResponse, SuccessResponse } from "@/lib/responses";
import {
  AuthNewAccessTokenRequestS,
  AuthNewAccessTokenResponseT,
} from "youwise-shared/api/auth";

export async function POST(request: Request) {
  const body = AuthNewAccessTokenRequestS.safeParse(await request.json());

  if (!body.success) {
    return ErrorResponse(body.error, 400);
  }

  const { refreshToken } = body.data;

  const refreshTokenDecoded = validateRefreshToken(refreshToken);
  if (!refreshTokenDecoded.userId) {
    return ErrorResponse(
      {
        error: refreshTokenDecoded.error,
        expired: refreshTokenDecoded.expired,
      },
      400
    );
  }

  const accessToken = generateAccessToken(refreshTokenDecoded.userId);

  return SuccessResponse<AuthNewAccessTokenResponseT>({
    accessToken: accessToken,
  });
}
