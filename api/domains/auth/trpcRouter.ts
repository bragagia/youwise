import { newAuthAccessToken } from "@/domains/auth/newAuthAccessToken.js";
import { validateOAuth } from "@/domains/auth/validateOAuth.js";
import { t } from "@/main/http/trpc.js";
import { z } from "zod/v4";

export const authTrpcRouter = t.router({
  auth: {
    newAccessToken: t.procedure
      .input(
        z.object({
          refreshToken: z.string(),
        })
      )
      .output(
        z.object({
          accessToken: z.string(),
        })
      )
      .query(async ({ ctx, input }) => {
        // Note: We don't require an access token, because it might have been lost as only the refresh token is persisted in the client

        const accessToken = await newAuthAccessToken(
          ctx.srv,
          input.refreshToken
        );

        return {
          accessToken,
        };
      }),

    validateOAuth: t.procedure
      .input(
        z.union([
          z.object({
            type: z.literal("google"),
            googleToken: z.string(),
          }),
          z.object({
            type: z.literal("apple"),
            appleToken: z.string(),
          }),
        ])
      )
      .output(
        z.object({
          userId: z.string(),
          accessToken: z.string(),
          refreshToken: z.string(),
        })
      )
      .query(async ({ ctx, input }) => {
        const oauth = await validateOAuth(ctx.srv, input);

        return {
          userId: oauth.user.id,
          accessToken: oauth.accessToken,
          refreshToken: oauth.refreshToken,
        };
      }),
  },
});
