import { authTrpcRouter } from "../../domains/auth/trpcRouter.js";
import { pingTrpcRouter } from "../../domains/ping/trpcRouter.js";
import { usersTrpcRouter } from "../../domains/users/trpcRouter.js";
import { t } from "./trpc.js";

export const mainRouter = t.mergeRouters(
  pingTrpcRouter,
  authTrpcRouter,
  usersTrpcRouter
);

export type MainRouter = typeof mainRouter;
