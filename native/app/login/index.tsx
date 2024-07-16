import Icons from "@/components/Icons";
import { useAPI } from "@/lib/api/apiProvider";
import {
  GoogleSignin,
  isErrorWithCode,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import * as AppleAuthentication from "expo-apple-authentication";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

GoogleSignin.configure({
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID!,
  scopes: [],
});

const LoginPage = () => {
  const insets = useSafeAreaInsets();
  const api = useAPI();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);

      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      if (!userInfo.idToken || !userInfo.user.givenName) {
        throw new Error("No idToken found");
      }

      const res = await api.auth.validateOAuth({
        type: "google",
        googleToken: userInfo.idToken,
        givenName: userInfo.user.givenName,
        email: userInfo.user.email,
      });
      if (res.error !== undefined) {
        setErrorMessage(res.error);
        setLoading(false);
        return;
      }

      await api._internal.setUser(
        {
          refreshToken: res.refreshToken,
          userId: res.userId,
        },
        res.accessToken
      );

      setLoading(false);
      router.back();
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
            <Icons.Xmark width={20} height={20} color="black" />
          </Pressable>
        </View>

        <View className="flex flex-col">
          <Icons.IconBare width={200} height={120} color="black" />

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
              onPress={async () => {
                try {
                  const credential = await AppleAuthentication.signInAsync({
                    requestedScopes: [
                      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                      AppleAuthentication.AppleAuthenticationScope.EMAIL,
                    ],
                  });

                  console.log(credential);
                  // signed in
                } catch (e: any) {
                  if (e.code === "ERR_REQUEST_CANCELED") {
                    // handle that the user canceled the sign-in flow
                  } else {
                    // handle other errors
                  }
                }
              }}
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
                <Icons.GoogleIconLogo width={12} height={12} color="white" />

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
