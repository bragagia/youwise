import { getResourcesList } from "@/domains/resources/getList.js";
import { t } from "@/main/http/trpc.js";
import { UnauthorizedError } from "@/utils/errors.js";
import { z } from "zod/v4";

export const resourcesTrpcRouter = t.router({
  resources: {
    getList: t.procedure
      .output(
        z.array(
          z.object({
            id: z.string(),
            cover: z.string(),
            name: z.string(),
          })
        )
      )
      .query(async ({ ctx }) => {
        if (ctx.auth.authed === false) throw new UnauthorizedError();

        const resources = await getResourcesList(ctx.srv, ctx.auth);

        return resources;
      }),
  },
});
