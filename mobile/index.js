import { registerRootComponent } from "expo";
import { ExpoRoot } from "expo-router";

// Must be exported or Fast Refresh won't update the context
export function App() {
  const ctx = require.context("./app");
  return <ExpoRoot context={ctx} />;
}

registerRootComponent(App);

// !!!!! This file is created to fix an error, as documented here: https://docs.expo.dev/router/reference/troubleshooting/ "Missing files or source maps in React Native DevTools"
