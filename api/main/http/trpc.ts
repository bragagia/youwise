import { initTRPC } from "@trpc/server";
import { TrpcContext } from "./context.js";

export const t = initTRPC.context<TrpcContext>().create();
