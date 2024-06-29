import CircularProgressView from "@/app/CircularProgress";
import Icons from "@/app/icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import React, { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import "@/app/global.css";

const HomeScreen = () => {
  const insets = useSafeAreaInsets();

  const [showRevision, setShowRevision] = useState(false);

  const userResources = [
    {
      id: "1",
      title: "Sapiens: Histoire du monde bla et blablabal",
      illustration: "book",
    },
    { id: "2", title: "Resource 2", illustration: "article" },
    { id: "3", title: "Resource 3", illustration: "video" },
    { id: "3", title: "Resource 3", illustration: "video" },
    { id: "3", title: "Resource 3", illustration: "video" },
  ];

  const startRevision = () => {
    // Add logic to start revision
    setShowRevision(!showRevision);
  };

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
          paddingTop: insets.top,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        }}
      >
        <View className="flex-row justify-between items-center px-4 pb-2">
          <View
            className="flex justify-center items-center"
            style={{ width: 24, height: 24 }}
          >
            <Icons.PersonCropCircleFill width={20} height={20} />
          </View>

          <Text className="text-3xl font-bold font-[Cochin-Bold]">
            Hey Professor!
          </Text>

          <Icons.SquareAndPencil width={24} height={24} />
        </View>
      </View>

      <ScrollView>
        <View
          style={{
            paddingBottom: revisionButtonMarginBottom + 64,
          }}
        >
          <View className="mt-16 mb-6 flex-col gap-3">
            <Text className="pl-2 text-md font-light text-gray-500 absolute">
              Last month progress
            </Text>

            <View className="w-full flex flex-row justify-start">
              <View className="w-full">
                <LineChart
                  data={lineDataAdded}
                  data2={lineDataMemorized}
                  // Size
                  maxValue={Math.max(...lineDataAdded.map((d) => d.value), 20)}
                  height={100}
                  initialSpacing={0}
                  endSpacing={0}
                  adjustToWidth
                  // Appearance
                  areaChart
                  curved
                  thickness1={3}
                  thickness2={3}
                  color1="rgb(60 60 60)"
                  color2="rgb(250 173 51)"
                  startFillColor1="rgb(60 60 60)"
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
          </View>

          {["Continue", "Saved for later", "Your library", "Explore"].map(
            (category) => (
              <View key={category} className="pt-3 border-t border-gray-200">
                <View className="flex-row justify-between px-6">
                  <Text className="text-lg font-medium">{category}</Text>

                  {category === "Your library" && (
                    <Text className="text-sm">View all</Text>
                  )}
                </View>

                <ScrollView horizontal className="">
                  <View className="flex flex-row pt-2 px-4 gap-3 mb-3">
                    {userResources.map((resource, i) => (
                      <Link key={i} href="/ressource">
                        <View className="w-40 flex flex-col">
                          <View
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
                              className="w-full h-28 rounded-lg"
                              alt="Resource image"
                            />
                          </View>

                          <View className="flex flex-row justify-between gap-1 mt-2 px-1">
                            <Text className="text-sm flex-1" numberOfLines={2}>
                              {resource.title}
                            </Text>

                            <View className="pt-[2px]">
                              <CircularProgressView progress={0.5} />
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

          <View className="border-t border-gray-200">
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
                    {resource.title}
                  </Text>

                  <Text
                    className="text-md flex-1 text-gray-500"
                    numberOfLines={2}
                  >
                    1k learned
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View className="absolute bottom-0 w-full z-10">
        <LinearGradient
          colors={["rgba(255,255,255,0)", "rgba(255,255,255,1)"]}
          style={{
            paddingBottom: revisionButtonMarginBottom,
            paddingRight: insets.right + 8,
            paddingLeft: insets.left + 16,
          }}
        >
          <View
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
            <View className="rounded-full overflow-hidden">
              <LinearGradient
                colors={[
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
                <Link asChild href="/revision">
                  <TouchableOpacity
                    onPress={startRevision}
                    className="bg-white rounded-full m-[2px]"
                  >
                    <View className="flex-row items-center justify-between py-4 px-6">
                      <View className="flex-row items-center gap-1">
                        <Icons.Lineweight width={16} height={16} />
                        <Text className="font-bold text-sm">4</Text>
                      </View>

                      <View className="flex-row items-center gap-2">
                        <Text className="text-lg font-bold">
                          Start daily revision
                        </Text>

                        <Icons.ArrowTriangleheadClockwise
                          width={20}
                          height={20}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                </Link>
              </LinearGradient>
            </View>
          </View>
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
