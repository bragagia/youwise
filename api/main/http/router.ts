import { authTrpcRouter } from "@/domains/auth/trpcRouter.js";
import { pingTrpcRouter } from "@/domains/ping/trpcRouter.js";
import { resourcesTrpcRouter } from "@/domains/resources/trpcRouter.js";
import { usersTrpcRouter } from "@/domains/users/trpcRouter.js";
import { t } from "@/main/http/trpc.js";

export const mainRouter = t.mergeRouters(
  pingTrpcRouter,
  authTrpcRouter,
  usersTrpcRouter,
  resourcesTrpcRouter
);

export type MainRouter = typeof mainRouter;
