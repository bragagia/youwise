import { validateRequestAccessToken } from "@/lib/jwt";
import { SuccessResponse } from "@/lib/responses";
import { Schema } from "zod";

// PrivateEndpointWrapper is a wrapper that:
// - Validate auth
// - Validate request body format
// - Validate and clean response to respect format
export function PrivateEndpointWrapper<ReqT, ResT>(
  reqSchema: Schema,
  resSchema: Schema,
  fn: ({
    request,
    body,
    userId,
  }: {
    request: Request;
    body: ReqT;
    userId: string;
  }) => Promise<ResT> | ResT
) {
  return async (request: Request) => {
    const { userId, tokenErrorResponse } = validateRequestAccessToken(request);
    if (tokenErrorResponse) return tokenErrorResponse;

    const body = reqSchema.parse(await request.json());

    const res = await fn({ request, body, userId });

    return SuccessResponse<ResT>(resSchema, res);
  };
}
