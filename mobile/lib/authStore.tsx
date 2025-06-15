import * as SecureStore from "expo-secure-store";

const AUTH_STORE_KEY = "auth";

export type AuthStorableType = {
  refreshToken: string;
  userId: string;
};

export async function getStoredAuth() {
  let auth = await SecureStore.getItemAsync(AUTH_STORE_KEY);

  if (!auth) {
    return undefined;
  }

  return JSON.parse(auth) as AuthStorableType;
}

export async function setStoredAuth(auth: AuthStorableType) {
  await SecureStore.setItemAsync(AUTH_STORE_KEY, JSON.stringify(auth));
}

export async function removeStoredAuth() {
  await SecureStore.deleteItemAsync(AUTH_STORE_KEY);
}
