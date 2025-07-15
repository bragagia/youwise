import { useAuth } from "@/components/providers/authProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
  const { refreshToken, accessToken, updateAccessToken, removeAuth } =
    useAuth();
  const [isRefreshingAccessToken, setIsRefreshingAccessToken] = useState(false);

  const trpcRaw = useMemo(
    () =>
      createTRPCClient<MainRouter>({
        links: [
          httpBatchLink({
            url: "https://api-youwise-dev.loca.lt/trpc", // TODO: Env
            transformer: {
              serialize: (data) => data,
              deserialize: (data) => data,
            }, // See api/main/http/trpc.ts for explanation
            async headers() {
              return {
                authorization: accessToken ? "Bearer " + accessToken : "",
                "bypass-tunnel-reminder": "1234", // TODO: Should only be used in development
              };
            },
          }),
        ],
      }),
    [accessToken]
  );

  const refreshAccessToken = useCallback(async () => {
    if (!isRefreshingAccessToken && refreshToken) {
      try {
        setIsRefreshingAccessToken(true);

        const res = await trpcRaw.auth.newAccessToken.query({
          refreshToken: refreshToken,
        });

        updateAccessToken(res.accessToken);
        setIsRefreshingAccessToken(false);
      } catch {
        setIsRefreshingAccessToken(false);
        // We logout the user if the refresh token is invalid
        removeAuth();
        router.replace("/");
      }
    }
  }, [
    isRefreshingAccessToken,
    refreshToken,
    setIsRefreshingAccessToken,
    updateAccessToken,
    removeAuth,
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

              // TODO: Check why error typing does't work
              const err = error as unknown as TRPCClientErrorLike<MainRouter>;

              if (err.data?.code === "UNAUTHORIZED") {
                try {
                  refreshAccessToken();
                } catch (e) {
                  console.error("Error refreshing access token:", e);
                  return false;
                }
              }

              // Retry all other errors, but only once
              return failureCount <= 1;
            },
          },
        },
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
