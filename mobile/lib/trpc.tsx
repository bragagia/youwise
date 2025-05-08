import { QueryClient } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import type { MainRouter } from "@youwise/api/main/http/router";

export const queryClient = new QueryClient();

const trpcClient = createTRPCClient<MainRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:3000/trpc", // TODO: Env
      transformer: { serialize: (data) => data, deserialize: (data) => data }, // See api/main/http/trpc.ts for explanation
    }),
  ],
});

export const trpc = createTRPCOptionsProxy<MainRouter>({
  client: trpcClient,
  queryClient,
});
