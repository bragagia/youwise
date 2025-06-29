import { z } from "zod/v4";
import { t } from "../../main/http/trpc.js";
import { UnauthorizedError } from "../../utils/errors.js";
import { getUserById } from "./users.js";

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

    // create: t.procedure
    //   .input(
    //     z.object({
    //       email: z.string(),
    //       givenName: z.string(),
    //     })
    //   )
    //   .mutation(async ({ ctx, input }) => {
    //     const userId = await createUser(ctx.srv, {
    //       email: input.email,
    //       givenName: input.givenName,
    //     });

    //     return {
    //       id: userId,
    //       email: input.email,
    //       givenName: input.givenName,
    //     };
    //   }),
  },
});
