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
  MemoriesNewRequest,
  memoriesNewResponseSchema,
  MemoriesUpdateRequest,
  memoriesUpdateResponseSchema,
  ResourceGetRequest,
  resourceGetResponseSchema,
  UserCreateRequest,
  userCreateResponseSchema,
  UserGetRecommendationsRequest,
  userResourcesResponseSchema,
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
    memories: {
      new: privateEndpointGen<MemoriesNewRequest>(apiContext)(
        memoriesNewResponseSchema,
        "memories/new"
      ),
      update: privateEndpointGen<MemoriesUpdateRequest>(apiContext)(
        memoriesUpdateResponseSchema,
        "memories/update"
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
        userCreateResponseSchema,
        "user/create"
      ),
      getRecommendations: privateEndpointGen<UserGetRecommendationsRequest>(
        apiContext
      )(userResourcesResponseSchema, "user/get-recommendations"),
    },
  };
}
