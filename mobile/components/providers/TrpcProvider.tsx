import { useAuth } from "@/components/providers/authProvider";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import {
  createTRPCClient,
  httpBatchLink,
  TRPCClient,
  TRPCClientErrorLike,
} from "@trpc/client";

import {
  createTRPCOptionsProxy,
  TRPCOptionsProxy,
} from "@trpc/tanstack-react-query";
import { MainRouter } from "@youwise/api/main/http/router";
import { router } from "expo-router";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

// Inspired by https://akhilaariyachandra.com/blog/refreshing-an-authentication-in-token-in-tanstack-query

const TrpcRawContext = createContext<TRPCClient<MainRouter> | null>(null);
const TrpcContext = createContext<TRPCOptionsProxy<MainRouter> | null>(null);

export function TrpcProvider({ children }: { children: ReactNode }) {
  const { refreshToken, accessToken, updateAccessToken } = useAuth();
  const [refreshingAccessToken, setRefreshingAccessToken] = useState(false);

  const trpcRaw = useMemo(
    () =>
      createTRPCClient<MainRouter>({
        links: [
          httpBatchLink({
            url: "http://localhost:3001/trpc", // TODO: Env
            transformer: {
              serialize: (data) => data,
              deserialize: (data) => data,
            }, // See api/main/http/trpc.ts for explanation
            async headers() {
              return {
                authorization: accessToken ? "Bearer " + accessToken : "",
              };
            },
          }),
        ],
      }),
    [accessToken]
  );

  const refreshAccessToken = useCallback(async () => {
    if (!refreshingAccessToken && refreshToken) {
      try {
        setRefreshingAccessToken(true);

        const res = await trpcRaw.auth.newAccessToken.query({
          refreshToken: refreshToken,
        });

        updateAccessToken(res.accessToken);
      } catch {
        router.replace("/");
      }

      setRefreshingAccessToken(false);
    }
  }, [
    refreshingAccessToken,
    refreshToken,
    setRefreshingAccessToken,
    updateAccessToken,
    trpcRaw,
  ]);

  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30000, // 30 seconds
            retry: (failureCount, error) => {
              // Don't retry for certain Unauthorized, should raise error and refresh token instantly
              console.error("RETRY:", error);
              const err = error as unknown as TRPCClientErrorLike<MainRouter>;
              // TODO: Check why error typing does't work
              if (err.data?.code === "UNAUTHORIZED") {
                return false;
              }

              // ? Why not do the token refresh inside this retry?

              // Retry all other errors, but only once
              return failureCount <= 1;
            },
          },
        },
        queryCache: new QueryCache({
          onError: (error) => {
            console.error("FAILURE:", error);
            const err = error as unknown as TRPCClientErrorLike<MainRouter>;
            // TODO: Check why error typing does't work
            if (err.data?.code === "UNAUTHORIZED") {
              refreshAccessToken();
            }
          },
        }),
      }),
    [refreshAccessToken]
  );

  const trpc = useMemo(
    () =>
      createTRPCOptionsProxy<MainRouter>({
        client: trpcRaw,
        queryClient,
      }),
    [trpcRaw, queryClient]
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TrpcRawContext.Provider value={trpcRaw}>
        <TrpcContext.Provider value={trpc}>{children}</TrpcContext.Provider>
      </TrpcRawContext.Provider>

      {/* {process.env.NODE_ENV === "development" && <ReactQueryDevtools />} */}
    </QueryClientProvider>
  );
}

export function useTrpcRaw() {
  const trpcRaw = useContext(TrpcRawContext);

  if (!trpcRaw) {
    throw new Error("useTrpcRaw must be used within a TrpcRawProvider");
  }

  return trpcRaw;
}

export function useTrpc() {
  const trpc = useContext(TrpcContext);

  if (!trpc) {
    throw new Error("useTrpc must be used within a TrpcProvider");
  }

  return trpc;
}
