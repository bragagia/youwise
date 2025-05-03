import { pingTrpcRouter } from "../../domains/ping/trpcRouter.js";
import { usersTrpcRouter } from "../../domains/users/trpcRouter.js";
import { t } from "./trpc.js";

export const mainRouter = t.mergeRouters(usersTrpcRouter, pingTrpcRouter);

export type MainRouter = typeof mainRouter;
