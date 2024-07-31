import { APIProvider } from "@/lib/api/apiProvider";
import { Stack } from "expo-router";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <APIProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Stack>
            <Stack.Screen
              name="index"
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="revision/index"
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="revision/[resourceId]/index"
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="ressource/[id]/index"
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="login/index"
              options={{
                headerShown: false,
                presentation: "modal",
              }}
            />

            <Stack.Screen
              name="account/index"
              options={{
                headerShown: false,
                presentation: "modal",
              }}
            />

            <Stack.Screen
              name="create/index"
              options={{
                headerShown: false,
                presentation: "modal",
              }}
            />
          </Stack>
        </GestureHandlerRootView>
      </APIProvider>
    </SafeAreaProvider>
  );
}
