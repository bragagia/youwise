import { APIContextType } from "@/lib/api/apiProvider";
import {
  privateEndpointGen,
  publicEndpointGen,
} from "@/lib/api/endpointGenerator";
import {
  authNewAccessTokenRequestSchema,
  authNewAccessTokenResponseSchema,
  authValidateOAuthRequestSchema,
  authValidateOAuthResponseSchema,
  dailyRevisionsGenerateRequestSchema,
  dailyRevisionsGenerateResponseSchema,
  memoriesNewRequestSchema,
  memoriesNewResponseSchema,
  memoriesUpdateRequestSchema,
  memoriesUpdateResponseSchema,
  resourceGetRequestSchema,
  resourceGetResponseSchema,
  resourcesCreateRequestSchema,
  resourcesCreateResponseSchema,
  userGetRecommendationsRequestSchema,
  userResourcesResponseSchema,
} from "youwise-shared/api";

export function newAPI(apiContext: APIContextType) {
  return {
    auth: {
      validateOAuth: publicEndpointGen(
        authValidateOAuthRequestSchema,
        authValidateOAuthResponseSchema,
        "auth/validate-oauth"
      ),
      newAccessToken: publicEndpointGen(
        authNewAccessTokenRequestSchema,
        authNewAccessTokenResponseSchema,
        "auth/new-access-token"
      ),
    },
    dailyRevisions: {
      generate: privateEndpointGen(
        apiContext,
        dailyRevisionsGenerateRequestSchema,
        dailyRevisionsGenerateResponseSchema,
        "daily-revisions/generate"
      ),
    },
    memories: {
      new: privateEndpointGen(
        apiContext,
        memoriesNewRequestSchema,
        memoriesNewResponseSchema,
        "memories/new"
      ),
      update: privateEndpointGen(
        apiContext,
        memoriesUpdateRequestSchema,
        memoriesUpdateResponseSchema,
        "memories/update"
      ),
    },
    resources: {
      get: privateEndpointGen(
        apiContext,
        resourceGetRequestSchema,
        resourceGetResponseSchema,
        "resources/get"
      ),
      create: privateEndpointGen(
        apiContext,
        resourcesCreateRequestSchema,
        resourcesCreateResponseSchema,
        "resources/create"
      ),
    },
    user: {
      getRecommendations: privateEndpointGen(
        apiContext,
        userGetRecommendationsRequestSchema,
        userResourcesResponseSchema,
        "user/get-recommendations"
      ),
    },
  };
}
