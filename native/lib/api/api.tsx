import { APIContextType } from "@/lib/api/apiProvider";
import {
  privateEndpointGen,
  publicEndpointGen,
} from "@/lib/api/endpointGenerator";
import {
  AuthNewAccessTokenRequestT,
  AuthNewAccessTokenResponseS,
  AuthValidateOAuthRequestT,
  AuthValidateOAuthResponseS,
} from "youwise-shared/api/auth";
import {
  UserCreateRequestT,
  UserResourcesResponseS,
} from "youwise-shared/api/user";
import { VoidResponseS } from "youwise-shared/api/void";

export function newAPI(apiContext: APIContextType) {
  return {
    auth: {
      validateOAuth: publicEndpointGen<AuthValidateOAuthRequestT>()(
        AuthValidateOAuthResponseS,
        "auth/validate-oauth"
      ),
      newAccessToken: publicEndpointGen<AuthNewAccessTokenRequestT>()(
        AuthNewAccessTokenResponseS,
        "auth/new-access-token"
      ),
    },
    user: {
      create: privateEndpointGen<UserCreateRequestT>(apiContext)(
        VoidResponseS,
        "user/create"
      ),
      getRecommendations: privateEndpointGen<void>(apiContext)(
        UserResourcesResponseS,
        "user/get-recommendations"
      ),
    },
  };
}
