import { generateAccessToken, validateRefreshToken } from "@/lib/jwt";
import { ErrorResponse, SuccessResponse } from "@/lib/responses";
import {
  authNewAccessTokenRequestSchema,
  AuthNewAccessTokenResponse,
  authNewAccessTokenResponseSchema,
} from "youwise-shared/api";

export async function POST(request: Request) {
  const body = authNewAccessTokenRequestSchema.safeParse(await request.json());

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

  return SuccessResponse<AuthNewAccessTokenResponse>(
    authNewAccessTokenResponseSchema,
    {
      accessToken: accessToken,
    }
  );
}
