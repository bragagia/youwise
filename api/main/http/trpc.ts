import { initTRPC } from "@trpc/server";
import { TrpcContext } from "./context.js";

export const t = initTRPC.context<TrpcContext>().create({
  // For some reason, the type inference of the output don't work without that basic transformer.
  // https://github.com/TanStack/router/issues/3057#issuecomment-2580971469
  transformer: {
    serialize: (data) => data,
    deserialize: (data) => data,
  },
});
