import { z } from "zod/v4";
import { t } from "../../main/http/trpc.js";
import { BadRequestError } from "../../utils/errors.js";
import { newAuthAccessToken } from "./newAuthAccessToken.js";
import { validateOAuth } from "./validateOAuth.js";

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
        if (!ctx.auth.authed && !ctx.auth.expired)
          throw new BadRequestError("");

        const accessToken = await newAuthAccessToken(
          ctx.srv,
          ctx.auth,
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
