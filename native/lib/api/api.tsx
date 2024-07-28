import { APIContextType } from "@/lib/api/apiProvider";
import {
  privateEndpointGen,
  publicEndpointGen,
} from "@/lib/api/endpointGenerator";
import {
  AuthNewAccessTokenRequest,
  authNewAccessTokenResponseSchema,
  AuthValidateOAuthRequest,
  authValidateOAuthResponseSchema,
  ResourceGetRequest,
  resourceGetResponseSchema,
  UserCreateRequest,
  userResourcesResponseSchema,
  voidResponseSchema,
} from "youwise-shared/api";

export function newAPI(apiContext: APIContextType) {
  return {
    auth: {
      validateOAuth: publicEndpointGen<AuthValidateOAuthRequest>()(
        authValidateOAuthResponseSchema,
        "auth/validate-oauth"
      ),
      newAccessToken: publicEndpointGen<AuthNewAccessTokenRequest>()(
        authNewAccessTokenResponseSchema,
        "auth/new-access-token"
      ),
    },
    resources: {
      get: privateEndpointGen<ResourceGetRequest>(apiContext)(
        resourceGetResponseSchema,
        "resources/get"
      ),
    },
    user: {
      create: privateEndpointGen<UserCreateRequest>(apiContext)(
        voidResponseSchema,
        "user/create"
      ),
      getRecommendations: privateEndpointGen<void>(apiContext)(
        userResourcesResponseSchema,
        "user/get-recommendations"
      ),
    },
  };
}
