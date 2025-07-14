import { getUserById } from "@/domains/users/users.js";
import { t } from "@/main/http/trpc.js";
import { UnauthorizedError } from "@/utils/errors.js";
import { z } from "zod/v4";

export const usersTrpcRouter = t.router({
  users: {
    getById: t.procedure
      .input(z.string())
      .output(
        z.object({
          id: z.string(),
          email: z.string(),
          givenName: z.string(),
        })
      )
      .query(async ({ ctx, input }) => {
        if (ctx.auth.authed === false) throw new UnauthorizedError();

        const user = await getUserById(ctx.srv, ctx.auth, input);

        return {
          id: user.id,
          email: user.email,
          givenName: user.given_name,
        };
      }),
  },
});
