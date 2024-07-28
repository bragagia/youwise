export type AuthNewAccessTokenRequest = {
  refreshToken: string;
};

export type AuthNewAccessTokenResponse = {
  accessToken: string;
};

export type AuthValidateOAuthRequest = {
  givenName: string;
  email: string;
} & (
  | {
      type: "google";
      googleToken: string;
    }
  | {
      type: "apple";
      appleToken: string;
    }
);

export type AuthValidateOAuthResponse = {
  refreshToken: string;
  accessToken: string;
  userId: string;
};
