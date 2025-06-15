import {
  AuthStorableType,
  getStoredAuth,
  removeStoredAuth,
  setStoredAuth,
} from "@/lib/authStore";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type AuthContextType = {
  refreshToken: string | undefined;
  accessToken: string | undefined;
  userId: string | undefined;
  setAuth: (user: AuthStorableType, refreshToken: string) => Promise<void>;
  removeAuth: () => Promise<void>;
  updateAccessToken: (accessToken: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  const [authCache, setAuthCache] = useState<AuthStorableType | undefined>(
    undefined
  );
  const [accessTokenCache, setAccessTokenCache] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    getStoredAuth().then((auth) => {
      setAuthCache(auth);
      setLoading(false);
    });
  }, []);

  const authContext = useMemo((): AuthContextType => {
    const res = {
      refreshToken: authCache?.refreshToken,
      accessToken: accessTokenCache,
      userId: authCache?.userId,
      setAuth: async (user: AuthStorableType, accessToken: string) => {
        await setStoredAuth(user);
        setAuthCache(user);
        setAccessTokenCache(accessToken);
      },
      removeAuth: async () => {
        await removeStoredAuth();
        setAuthCache(undefined);
        setAccessTokenCache(undefined);
      },
      updateAccessToken: async (accessToken: string) => {
        setAccessTokenCache(accessToken);
      },
    };

    return res;
  }, [authCache, accessTokenCache]);

  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return authContext;
}

export function SignedInOnly({ children }: { children?: React.ReactNode }) {
  const { userId } = useAuth();

  if (!userId) {
    return null;
  }

  return <>{children}</>;
}

export function SignedOutOnly({ children }: { children?: React.ReactNode }) {
  const { userId } = useAuth();

  if (userId) {
    return null;
  }

  return <>{children}</>;
}
