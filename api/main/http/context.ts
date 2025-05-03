import { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";
import { Services } from "../envs/type.js";

export function buildCreateContext(services: Services) {
  return ({ req, res }: CreateFastifyContextOptions) => {
    //const user = { name: req.headers.username ?? "anonymous" };
    return { req, res, srv: services };
  };
}

export type TrpcContext = Awaited<
  ReturnType<ReturnType<typeof buildCreateContext>>
>;
