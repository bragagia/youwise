import {
  fastifyTRPCPlugin,
  FastifyTRPCPluginOptions,
} from "@trpc/server/adapters/fastify";
import Fastify from "fastify";
import { Services } from "../envs/type.js";
import { buildCreateContext } from "./context.js";
import { mainRouter, MainRouter } from "./router.js";

export function startHttpServer(services: Services) {
  const fastify = Fastify({
    logger: true,
    maxParamLength: 5000, // Required by tRPC
  });

  fastify.register(fastifyTRPCPlugin, {
    prefix: "/trpc",
    trpcOptions: {
      router: mainRouter,
      createContext: buildCreateContext(services),
      onError({ path, error }) {
        // report to error monitoring
        console.error(`Error in tRPC handler on path '${path}':`, error);
      },
    } satisfies FastifyTRPCPluginOptions<MainRouter>["trpcOptions"],
  });

  fastify.listen({ port: 3000 }, function (err, address) {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }

    console.log(`Server is now listening on ${address}`);
  });
}
