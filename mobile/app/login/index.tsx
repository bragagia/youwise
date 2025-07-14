import Icons from "@/components/Icons";
import { useAuth } from "@/components/providers/authProvider";
import { useTrpcRaw } from "@/components/providers/TrpcProvider";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import * as AppleAuthentication from "expo-apple-authentication";
import { Redirect, router } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

GoogleSignin.configure({
  iosClientId:
    "835524820983-nlqq9pme2t88rtjft5v2tu2c3j99d52o.apps.googleusercontent.com",
  scopes: [],
});

// Rewriting this as it was deleted from the free version of google-signin lib
function isErrorWithCode(error: any): error is { code: string } {
  return error && typeof error.code === "string";
}

const LoginPage = () => {
  const { accessToken, setAuth, removeAuth } = useAuth();
  const insets = useSafeAreaInsets();

  const trpcRaw = useTrpcRaw();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);

      await removeAuth();

      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      if (!userInfo.data?.idToken) {
        throw new Error("No idToken or full name found");
      }

      trpcRaw.auth.validateOAuth
        .query({
          type: "google",
          googleToken: userInfo.data.idToken,
        })
        .then(async (res) => {
          if (!res.accessToken || !res.refreshToken || !res.userId) {
            throw new Error("Invalid response from server");
          }

          await setAuth(
            {
              refreshToken: res.refreshToken,
              userId: res.userId,
            },
            res.accessToken
          );

          setLoading(false);
          router.back();
        })
        .catch((error) => {
          console.error("Error validating OAuth:", error);
          setErrorMessage(error.message || "Failed to validate OAuth");
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            setLoading(false);
            break;
          case statusCodes.IN_PROGRESS:
            // operation (eg. sign in) already in progress
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            setErrorMessage("Play services not available or outdated");
            setLoading(false);
            break;
          default:
            setErrorMessage("Something went wrong");
            setLoading(false);
        }
      } else {
        setErrorMessage("Something went wrong");
        setLoading(false);
      }
    }
  };

  const handleAppleSignIn = async () => {
    try {
      setLoading(true);
      console.log("Starting Apple Sign In...");

      // await AppleAuthentication.signOutAsync({
      //   // This is necessary to ensure that the user can sign in again
      //   // if they have already signed in before.
      //   // It will not remove the user's Apple ID from the device.
      //   // It will only remove the cached credentials for this app.
      //   user: "mathias.bragagia@gmail.com",
      // });
      const credentials = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      console.log("CREDS:", credentials.identityToken);

      trpcRaw.auth.validateOAuth
        .query({
          type: "apple",
          appleToken: credentials.identityToken || "",
        })
        .then(async (res) => {
          if (!res.accessToken || !res.refreshToken || !res.userId) {
            throw new Error("Invalid response from server");
          }

          await setAuth(
            {
              refreshToken: res.refreshToken,
              userId: res.userId,
            },
            res.accessToken
          );

          setLoading(false);
          router.back();
        })
        .catch((error) => {
          console.error("Error validating OAuth:", error);
          setErrorMessage(error.message || "Failed to validate OAuth");
          setLoading(false);
        });
      // signed in
    } catch (e: any) {
      if (e.code === "ERR_REQUEST_CANCELED") {
        console.log("Apple Sign In Error:", e);
        setLoading(false);
        // handle that the user canceled the sign-in flow
      } else {
        console.log("Apple Sign In Error:", e);
        setLoading(false);
        // handle other errors
      }
    }
  };

  if (accessToken) {
    return <Redirect href="/" />;
  }

  return (
    <View
      className="bg-red-400 min-h-full"
      style={{
        paddingTop: 6,
        paddingLeft: Math.max(6, insets.left),
        paddingRight: Math.max(6, insets.right),
      }}
    >
      <View className="flex flex-col justify-between h-full items-center gap-20">
        <View className="flex flex-row justify-end w-full p-5">
          <Pressable
            className="active:opacity-30 transition-opacity"
            onPress={() => router.back()}
          >
            <Icons.Xmark size={20} color="black" />
          </Pressable>
        </View>

        <View className="flex flex-col">
          <Icons.IconBare size={120} color="black" />

          <Text className="text-center text-4xl font-bold font-[GillSans]">
            YouWise
          </Text>
        </View>

        {loading ? (
          <View>
            <Text>Loading...</Text>
          </View>
        ) : (
          <View className="flex flex-col items-center gap-3 mb-24">
            {errorMessage ? (
              <Text className="text-black font-bold text-lg">
                {errorMessage}
              </Text>
            ) : null}

            <AppleAuthentication.AppleAuthenticationButton
              buttonType={
                AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN
              }
              buttonStyle={
                AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
              }
              cornerRadius={5}
              style={{
                width: 200,
                height: 44,
              }}
              onPress={handleAppleSignIn}
            />

            <Pressable
              className="active:opacity-50 transition-opacity"
              onPress={handleGoogleSignIn}
            >
              <View
                className="flex flex-row items-center gap-[0.3rem] bg-neutral-200 rounded-md px-4"
                style={{
                  width: 200,
                  height: 40,
                }}
              >
                <Icons.GoogleIconLogo size={12} />

                <Text className="font-[Avenir] font-semibold text-black">
                  Sign in with Google
                </Text>
              </View>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
};

export default LoginPage;
