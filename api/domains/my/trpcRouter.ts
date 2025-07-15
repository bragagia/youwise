import { getHomepage } from "@/domains/my/homepage.js";
import { t } from "@/main/http/trpc.js";
import { UnauthorizedError } from "@/utils/errors.js";
import { z } from "zod/v4";

export const myTrpcRouter = t.router({
  my: {
    getHomepage: t.procedure
      .output(
        z.object({
          resources: z.array(
            z.object({
              id: z.string(),
              cover: z.string(),
              name: z.string(),
            })
          ),
        })
      )
      .query(async ({ ctx }) => {
        if (ctx.auth.authed === false) throw new UnauthorizedError();

        const homepage = await getHomepage(ctx.srv, ctx.auth);

        return homepage;
      }),
  },
});
