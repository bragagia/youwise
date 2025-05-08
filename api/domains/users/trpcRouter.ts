import { z } from "zod";
import { t } from "../../main/http/trpc.js";

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
      .query(async (opts) => {
        const user = await opts.ctx.srv.db
          .selectFrom("users")
          .selectAll()
          .where("id", "=", opts.input)
          .executeTakeFirst();

        if (!user) {
          throw new Error("User not found");
        }

        return {
          id: user.id,
          email: user.email,
          givenName: user.given_name,
        };
      }),

    create: t.procedure
      .input(
        z.object({
          name: z.string().min(3),
          email: z.string(),
          givenName: z.string(),
        })
      )
      .mutation(async (opts) => {
        const id = Date.now().toString();

        await opts.ctx.srv.db
          .insertInto("users")
          .values({
            id,
            email: opts.input.email,
            given_name: opts.input.givenName,
          })
          .executeTakeFirstOrThrow();
      }),
  },
});
