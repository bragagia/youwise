import { initTRPC } from "@trpc/server";
import { TrpcContext } from "./context.js";

export const t = initTRPC.context<TrpcContext>().create({
  // For some reason, the type inference of the output don't work without that basic transformer.
  // https://github.com/TanStack/router/issues/3057#issuecomment-2580971469
  transformer: {
    serialize: (data) => data,
    deserialize: (data) => data,
  },
  // errorFormatter(opts) {
  //   const { shape, error } = opts;
  //   return {
  //     ...shape,
  //     data: {
  //       ...shape.data,
  //       zodError:
  //         error.code === "BAD_REQUEST" && error.cause instanceof ZodError
  //           ? error.cause.flatten()
  //           : null,
  //     },
  //   };
  // },
});
