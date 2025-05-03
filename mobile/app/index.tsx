import Icons from "@/components/Icons";
import { Link, router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import "./global.css";

import { mockRessources } from "@/lib/types/MOCK";
import { LinearGradient } from "expo-linear-gradient";

export function SignedInOnly({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

export function SignedOutOnly({ children }: { children?: React.ReactNode }) {
  return <></>;
}

type RessourceArray = {
  id: string;
  name: string;
}[];

type UserResourcesResponse = {
  continue: RessourceArray;
  saveForLater: RessourceArray;
  library: RessourceArray;
  explore: RessourceArray;
};

const HomeScreen = () => {
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(true);

  const [userResources, setUserResources] = useState<UserResourcesResponse>();

  const onRefresh = () => {
    setLoading(true);

    // api.user.getRecommendations({})

    setUserResources({
      library: mockRessources,
      explore: [],
      continue: [],
      saveForLater: [],
    });

    setLoading(false);
  };

  useEffect(() => {
    onRefresh();
  }, []);

  const revisionButtonMarginBottom = Math.max(insets.bottom, 8);

  const lineDataMemorized = [
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 5 },
    { value: 10 },
    { value: 15 },
    { value: 20 },
    { value: 25 },
    { value: 25 },
    { value: 25 },
    { value: 35 },
    { value: 40 },
    { value: 45 },
    { value: 50 },
    { value: 50 },
    { value: 55 },
    { value: 60 },
    { value: 65 },
    { value: 70 },
    { value: 75 },
    { value: 75 },
    { value: 80 },
    { value: 85 },
    { value: 90 },
    { value: 95 },
    { value: 100 },
    { value: 100 },
    { value: 105 },
    { value: 110 },
    { value: 115 },
  ];

  const lineDataAdded = [
    { value: 50 },
    { value: 55 },
    { value: 60 },
    { value: 70 },
    { value: 80 },
    { value: 90 },
    { value: 100 },
    { value: 110 },
    { value: 120 },
    { value: 130 },
    { value: 135 },
    { value: 140 },
    { value: 145 },
    { value: 150 },
    { value: 155 },
    { value: 160 },
    { value: 165 },
    { value: 170 },
    { value: 175 },
    { value: 180 },
    { value: 185 },
    { value: 190 },
    { value: 195 },
    { value: 200 },
    { value: 200 },
    { value: 200 },
    { value: 200 },
    { value: 200 },
    { value: 200 },
    { value: 200 },
  ];

  return (
    <View className="flex-1 bg-white">
      <View
        style={{
          paddingTop: Math.max(6, insets.top),
          paddingLeft: Math.max(12, insets.left),
          paddingRight: Math.max(12, insets.right),
          paddingBottom: 6,
        }}
      >
        <View className="flex-row justify-between items-center">
          <View className="flex-1 flex flex-row">
            <SignedInOnly>
              <Pressable
                className="flex-row justify-center items-center active:opacity-30 transition-opacity"
                onPress={() => router.push("/")} // /account
              >
                <Icons.PersonCropCircleFill size={20} />
              </Pressable>
            </SignedInOnly>
          </View>

          <Text className="text-3xl font-bold font-[GillSans-SemiBold]">
            {/* Optima-ExtraBlack */}
            YouWise
          </Text>

          <View className="flex-1 flex flex-row justify-end">
            <SignedInOnly>
              <Pressable
                className="active:opacity-30 transition-opacity"
                onPress={() => router.push("/")} // /create
              >
                <Icons.SquareAndPencil size={24} />
              </Pressable>
            </SignedInOnly>

            <SignedOutOnly>
              <Pressable
                className="flex-row gap-2 justify-center items-center border-2 border-neutral-800 py-1 pl-1 pr-2 rounded-full active:opacity-30 transition-opacity"
                onPress={() => router.push("/")} // /login
              >
                <Icons.PersonCropCircleFill size={20} />

                <Text className="text-sm font-medium">Sign in</Text>
              </Pressable>
            </SignedOutOnly>
          </View>
        </View>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={loading} /> // onRefresh={onRefresh}
        }
      >
        {!loading ? (
          <View
            style={{
              paddingBottom: revisionButtonMarginBottom + 64,
            }}
          >
            {/* <View className="mt-16 mb-6 flex-col gap-3">
              <Text className="pl-2 text-md font-light text-neutral-500 absolute">
                Last month progress
              </Text>

              <View className="w-full flex flex-row justify-start">
                <View className="w-full">
                  <LineChart
                    data={lineDataAdded}
                    data2={lineDataMemorized}
                    // Size
                    maxValue={Math.max(
                      ...lineDataAdded.map((d) => d.value),
                      20
                    )}
                    height={100}
                    initialSpacing={0}
                    endSpacing={0}
                    adjustToWidth
                    // Appearance
                    areaChart
                    curved
                    thickness1={3}
                    thickness2={3}
                    color1="rgb(230 230 230)"
                    color2="rgb(250 173 51)"
                    startFillColor1="rgb(230 230 230)"
                    startFillColor2="rgb(250 173 51)"
                    startOpacity={0.15}
                    endOpacity={0}
                    // Remove useless features
                    hideAxesAndRules
                    hideYAxisText
                    yAxisThickness={0}
                    yAxisLabelWidth={0}
                    hideRules
                    hideDataPoints
                    disableScroll
                  />
                </View>
              </View>
            </View> */}

            {["Continue", "Saved for later", "Your library", "Explore"].map(
              (category) => (
                <View
                  key={category}
                  className="pt-3 border-b border-neutral-200"
                >
                  <View className="flex-row justify-between px-6">
                    <Text className="text-lg font-medium">{category}</Text>

                    {category === "Your library" && (
                      <Text className="text-sm">View all</Text>
                    )}
                  </View>

                  <ScrollView horizontal className="">
                    <View className="flex flex-row pt-2 px-4 gap-3 mb-3">
                      {category === "Your library" &&
                        userResources?.library.map((resource, i) => (
                          <Link key={i} href={"/"}>
                            {/* "/ressource/" + resource.id */}
                            <View className="w-40 flex flex-col">
                              <View
                                className="rounded-lg bg-white"
                                style={{
                                  shadowColor: "#000",
                                  shadowOffset: {
                                    width: 2,
                                    height: 4,
                                  },
                                  shadowOpacity: 0.3,
                                  shadowRadius: 5,
                                  elevation: 5, // Android only
                                }}
                              >
                                <Image
                                  source={require("./../assets/images/homeImage.jpg")}
                                  className="rounded-lg"
                                  style={{
                                    height: 112,
                                    width: "100%",
                                  }}
                                  alt="Resource image"
                                />
                              </View>

                              <View className="flex flex-row justify-between gap-1 mt-2 px-1">
                                <Text
                                  className="text-sm flex-1"
                                  numberOfLines={2}
                                >
                                  {resource.name}
                                </Text>

                                <View className="pt-[2px]">
                                  {/* <CircularProgressView progress={0.5} /> */}
                                </View>
                              </View>
                            </View>
                          </Link>
                        ))}
                    </View>
                  </ScrollView>
                </View>
              )
            )}

            {/* <View className="border-t border-neutral-200">
              <Text className="mt-8 mb-4 mx-6 text-2xl font-medium">
                Discover
              </Text>

              {userResources.map((resource, i) => (
                <View key={i} className="w-full flex flex-col mt-4">
                  <View>
                    <Image
                      source={require("./../assets/images/homeImage.jpg")}
                      className="w-full h-48"
                      alt="Resource image"
                    />
                  </View>

                  <View className="flex flex-col justify-between gap-1 m-2">
                    <Text className="text-lg flex-1" numberOfLines={2}>
                      {resource.name}
                    </Text>

                    <Text
                      className="text-md flex-1 text-neutral-500"
                      numberOfLines={2}
                    >
                      1k learned
                    </Text>
                  </View>
                </View>
              ))}
            </View> */}
          </View>
        ) : null}
      </ScrollView>

      <View className="absolute bottom-0 w-full z-10 border-white flex flex-col">
        <LinearGradient
          colors={[
            "rgba(255,255,255,0)",
            "rgba(255,255,255,1)",
            "rgba(255,255,255,1)",
          ]}
          style={{
            paddingRight: insets.right + 12,
            paddingLeft: insets.left + 12,
            paddingBottom: revisionButtonMarginBottom,
          }}
        >
          <Link asChild href="/revision">
            <TouchableOpacity className="rounded-full overflow-hidden">
              <LinearGradient
                colors={[
                  // "rgb(229, 48, 24)",
                  // "rgb(229, 48, 24)",
                  "rgb(255, 149, 0)", // Orange
                  "rgb(255, 204, 0)", // Yellow
                  "rgb(255, 204, 0)", // Yellow
                  "rgb(255, 204, 0)", // Yellow
                  "rgb(52, 199, 89)", // Green
                  "rgb(0, 122, 255)", // Blue
                  "rgb(88, 86, 214)", // Indigo
                  "rgb(191, 90, 242)", // Violet
                  "rgb(225, 59, 48)", // Red
                ]}
                start={{ x: 0.5, y: 3 }}
                end={{ x: 0.8, y: 0 }}
                className="rounded-full"
              >
                <View className="bg-white rounded-full m-[2px]">
                  <View className="flex-row items-center justify-between py-3 px-6">
                    <View className="flex-row items-center gap-1">
                      <Icons.LineWeight size={16} color={"black"} />
                      <Text className="font-bold text-sm">4</Text>
                    </View>

                    <View className="flex-row items-center gap-2">
                      <Text className="text-lg font-bold font-[Avenir]">
                        Start daily{" "}
                        <Text className="font-[GillSans]">ReWise</Text>
                      </Text>

                      <Icons.PlayFill size={14} color={"black"} />
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Link>
        </LinearGradient>
      </View>
    </View>
  );
};

// Entry point for the app
const App = () => {
  return <HomeScreen />;
};

export default App;
