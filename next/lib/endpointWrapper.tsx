import { validateRequestAccessToken } from "@/lib/jwt";
import { ErrorResponse, SuccessResponse } from "@/lib/responses";

// PrivateEndpointWrapper is a wrapper that:
// - Validate auth
// - Validate request body format
// - Validate and clean response to respect format
export function PrivateEndpointWrapper<
  ReqT extends Zod.Schema<any, any, any>,
  ResT extends Zod.Schema<any, any, any>
>(
  reqSchema: ReqT,
  resSchema: ResT,
  fn: ({
    request,
    body,
    userId,
  }: {
    request: Request;
    body: Zod.infer<ReqT>;
    userId: string;
  }) => Promise<Zod.infer<ResT>> | Zod.infer<ResT>
) {
  return async (request: Request) => {
    const { userId, tokenErrorResponse } = validateRequestAccessToken(request);
    if (tokenErrorResponse) return tokenErrorResponse;

    let bodyJson: any;
    let body: Zod.infer<ReqT>;
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

    return SuccessResponse<Zod.infer<ResT>>(resSchema, res);
  };
}
