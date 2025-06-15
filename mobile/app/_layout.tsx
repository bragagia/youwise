import { AuthProvider } from "@/components/providers/authProvider";
import { TrpcProvider } from "@/components/providers/TrpcProvider";
import { Stack } from "expo-router";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthProvider>
          <TrpcProvider>
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
            </Stack>
          </TrpcProvider>
        </AuthProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
