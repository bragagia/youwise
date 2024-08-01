import { newAPI } from "@/lib/api/api";
import {
  getStoredUser,
  removeStoredUser,
  setUserStored,
  UserStorableType,
} from "@/lib/api/userStore";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type APIContextType = {
  userStored?: UserStorableType;
  _internal: {
    accessToken?: string;
    setUser: (user: UserStorableType, accessToken: string) => Promise<void>;
    removeUser: () => Promise<void>;
    updateAccessToken: (accessToken: string) => Promise<void>;
  };
};

const APIContext = createContext<APIContextType | null>(null);

export function APIProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [userCache, setUserCache] = useState<UserStorableType | undefined>(
    undefined
  );
  const [accessTokenCache, setAccessTokenCache] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    getStoredUser().then((auth) => {
      setUserCache(auth);
      setLoading(false);
    });
  }, []);

  const apiContext = useMemo((): APIContextType => {
    return {
      userStored: userCache,
      _internal: {
        accessToken: accessTokenCache,
        setUser: async (user: UserStorableType, accessToken: string) => {
          await setUserStored(user);
          setAccessTokenCache(accessToken);
          setUserCache(user);
        },
        removeUser: async () => {
          await removeStoredUser();
          setUserCache(undefined);
          setAccessTokenCache(undefined);
        },
        updateAccessToken: async (accessToken: string) => {
          setAccessTokenCache(accessToken);
        },
      },
    };
  }, [userCache, accessTokenCache]);

  if (loading) {
    return null;
  }

  return (
    <APIContext.Provider value={apiContext}>{children}</APIContext.Provider>
  );
}

export type APIType = APIContextType & ReturnType<typeof newAPI>;

export function useAPI() {
  const apiContext = useContext(APIContext);

  if (!apiContext) {
    throw new Error("useAPI must be used within an APIProvider");
  }

  const [publicAPI, setPublicAPI] = useState<APIType>({
    ...apiContext,
    ...newAPI(apiContext),
  });

  useEffect(() => {
    setPublicAPI({
      ...apiContext,
      ...newAPI(apiContext),
    });
  }, [apiContext]);

  return publicAPI;
}
