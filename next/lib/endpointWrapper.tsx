import { validateRequestAccessToken } from "@/lib/jwt";
import { ErrorResponse, SuccessResponse } from "@/lib/responses";
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

    let bodyJson: any;
    let body: ReqT;
    try {
      bodyJson = await request.json();
      body = reqSchema.parse(bodyJson);
    } catch (err) {
      if (bodyJson) {
        console.log("bodyJson", JSON.stringify(bodyJson, null, 2));
      }

      return ErrorResponse(err, 400);
    }

    const res = await fn({ request, body, userId });

    return SuccessResponse<ResT>(resSchema, res);
  };
}
