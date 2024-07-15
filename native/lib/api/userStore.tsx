import * as SecureStore from "expo-secure-store";

const USER_STORE_KEY = "user";

export type UserStorableType = {
  refreshToken: string;
  userId: string;
};

export async function getStoredUser() {
  let user = await SecureStore.getItemAsync(USER_STORE_KEY);

  if (!user) {
    return undefined;
  }

  return JSON.parse(user) as UserStorableType;
}

export async function setUserStored(user: UserStorableType) {
  await SecureStore.setItemAsync(USER_STORE_KEY, JSON.stringify(user));
}

export async function removeStoredUser() {
  await SecureStore.deleteItemAsync(USER_STORE_KEY);
}
