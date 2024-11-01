import { APIContextType } from "@/lib/api/apiProvider";
import {
  authNewAccessTokenRequestSchema,
  authNewAccessTokenResponseSchema,
} from "youwise-shared/api";

const API_URL = process.env.EXPO_PUBLIC_API_URL!;

const newAccessTokenEndpoint = publicEndpointGen(
  authNewAccessTokenRequestSchema,
  authNewAccessTokenResponseSchema,
  "auth/new-access-token"
);

export type EndpointReturnType<T extends Zod.Schema<any, any, any>> =
  | ({ error: undefined; code: undefined } & Zod.infer<T>)
  | { error: string; code: number };

export function publicEndpointGen<
  ReqST extends Zod.Schema<any, any, any>,
  ResST extends Zod.Schema<any, any, any>
>(requestSchema: ReqST, responseSchema: ResST, uri: string) {
  return _endpointGeneratorInternal<Zod.infer<ReqST>, ResST>(
    responseSchema,
    uri
  );
}

export function privateEndpointGen<
  ReqST extends Zod.Schema<any, any, any>,
  ResST extends Zod.Schema<any, any, any>
>(
  apiContext: APIContextType,
  requestSchema: ReqST,
  responseSchema: ResST,
  uri: string
) {
  // We create an new endpoint wrapping the internal one that will add the authorization header, refreshing the token if needed
  return async (data: Zod.infer<ReqST>): Promise<EndpointReturnType<ResST>> => {
    if (!apiContext.userStored) {
      return {
        error: "User not logged in",
        code: 401,
      };
    }

    let accessToken = apiContext._internal.accessToken;
    if (accessToken) {
      const firstInternalEndpoint = _endpointGeneratorInternal<
        Zod.infer<ReqST>,
        ResST
      >(responseSchema, uri, {
        Authorization: `Bearer ${accessToken}`,
      });

      const firstRes = await firstInternalEndpoint(data);

      // We need to cast as any because, as ResST is a generic, TS can't know that the error field exists or has been overwritten by ResST
      const firstResForceCast = firstRes as
        | { error: string; code: number }
        | { error: undefined; code: undefined };

      if (firstResForceCast.code !== 400 && firstResForceCast.code !== 401) {
        return firstRes;
      }
    }

    // get new access token
    const res = await newAccessTokenEndpoint({
      refreshToken: apiContext.userStored.refreshToken,
    });
    if (res.error !== undefined) {
      apiContext._internal.removeUser();

      if (res.code === 400) {
        console.log("Refresh token expired, logging user out");
      } else {
        console.log("Error refreshing token: ", res.error);
      }

      return {
        error: res.error,
        code: res.code,
      };
    }

    accessToken = res.accessToken;
    await apiContext._internal.updateAccessToken(res.accessToken);

    const secondInternalEndpoint = _endpointGeneratorInternal<
      Zod.infer<ReqST>,
      ResST
    >(responseSchema, uri, {
      Authorization: `Bearer ${accessToken}`,
    });
    return await secondInternalEndpoint(data);
  };
}

function _endpointGeneratorInternal<
  ReqT,
  ResST extends Zod.Schema<any, any, any>
>(
  responseSchema: ResST,
  uri: string,
  additionalHeader?: { [key: string]: string }
) {
  return async (data: ReqT): Promise<EndpointReturnType<ResST>> => {
    try {
      const res = await fetch(API_URL + uri, {
        method: "POST",
        headers: {
          ...additionalHeader,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (
        res.status !== 200 ||
        res.headers.get("Content-Type") !== "application/json"
      ) {
        const bodyText = await res.text();

        return {
          error: bodyText,
          code: res.status,
        };
      }

      const bodyObj = await res.json();

      const body = responseSchema.safeParse(bodyObj);
      if (!body.success) {
        return {
          error: body.error.message,
          code: 400,
        };
      }

      return { ...body.data, error: undefined, code: undefined };
    } catch (e: any) {
      return {
        error:
          "fetch error: " +
          (e.message || e.toString() || "Unknown client error"),
        code: 400,
      };
    }
  };
}
