import { z } from "zod";

export const AuthNewAccessTokenRequestS = z.object({
  refreshToken: z.string(),
});
export type AuthNewAccessTokenRequestT = z.infer<
  typeof AuthNewAccessTokenRequestS
>;

export const AuthNewAccessTokenResponseS = z.object({
  accessToken: z.string(),
});
export type AuthNewAccessTokenResponseT = z.infer<
  typeof AuthNewAccessTokenResponseS
>;

export const AuthValidateOAuthRequestS = z
  .object({
    givenName: z.string(),
    email: z.string().email(),
  })
  .and(
    z
      .object({
        type: z.literal("google"),
        googleToken: z.string(),
      })
      .or(
        z.object({
          type: z.literal("apple"),
          appleToken: z.string(),
        })
      )
  );
export type AuthValidateOAuthRequestT = z.infer<
  typeof AuthValidateOAuthRequestS
>;

export const AuthValidateOAuthResponseS = z.object({
  refreshToken: z.string(),
  accessToken: z.string(),
  userId: z.string(),
});
export type AuthValidateOAuthResponseT = z.infer<
  typeof AuthValidateOAuthResponseS
>;
