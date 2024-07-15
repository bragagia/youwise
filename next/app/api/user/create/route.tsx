import { validateRequestAccessToken } from "@/lib/jwt";
import { SuccessResponse } from "@/lib/responses";
import { VoidResponseT } from "youwise-shared/api/void";

export async function POST(request: Request) {
  const { userId, tokenErrorResponse } = validateRequestAccessToken(request);
  if (tokenErrorResponse) return tokenErrorResponse;

  return SuccessResponse<VoidResponseT>({});
}
