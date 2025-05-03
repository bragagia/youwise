import { z } from "zod";
import { t } from "../../main/http/trpc.js";

export const usersTrpcRouter = t.router({
  users: {
    getById: t.procedure.input(z.string()).query(async (opts) => {
      const user = await opts.ctx.srv.db
        .selectFrom("users")
        .selectAll()
        .where("id", "=", opts.input)
        .executeTakeFirst();

      return user;
    }),

    create: t.procedure
      .input(
        z.object({
          name: z.string().min(3),
          firstName: z.string(),
          lastName: z.string(),
        })
      )
      .mutation(async (opts) => {
        const id = Date.now().toString();

        await opts.ctx.srv.db
          .insertInto("users")
          .values({
            id,
            first_name: opts.input.firstName,
            last_name: opts.input.lastName,
          })
          .executeTakeFirstOrThrow();
      }),
  },
});
