import Icons from "@/app/icons";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";
import { RevisionActionButton } from "./RevisionActionButton";
import { RevisionStats } from "./useLocalRevisionEngine";

export function RevisionStatsCard({
  finishedStats,
}: {
  finishedStats: RevisionStats;
}): React.ReactNode {
  const scaleWellDone = useRef(new Animated.Value(0)).current;
  const scaleStats = useRef(new Animated.Value(0)).current;
  const scaleButton = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleWellDone, {
      toValue: 1,
      useNativeDriver: true,
      delay: 400,
    }).start();

    Animated.spring(scaleStats, {
      toValue: 1,
      useNativeDriver: true,
      delay: 1000,
    }).start();

    Animated.spring(scaleButton, {
      toValue: 1,
      useNativeDriver: true,
      delay: 1200,
    }).start();
  }, []);

  return (
    <View className="absolute top-0 flex flex-col justify-center w-full h-full px-4">
      <View className="flex-1 flex flex-col justify-center">
        <Animated.Text
          className="text-5xl font-bold text-center text-white shadow font-[Avenir] mt-14"
          style={{
            transform: [{ scale: scaleWellDone }],
          }}
        >
          Well done!
        </Animated.Text>
      </View>

      <Animated.View
        className="rounded-xl overflow-hidden mx-4 my-12"
        style={{
          backgroundColor: "rgba(245, 245, 245, 0.6)", // bg-neutral-100
          transform: [{ scale: scaleStats }],
        }}
      >
        <BlurView className="flex flex-col gap-6 py-5 px-6">
          <View className="flex flex-row justify-between">
            <Text className="text-lg text-neutral-500 font-[Avenir] font-bold">
              <Text className="font-bold text-2xl text-black">
                {finishedStats.newlyLearned}{" "}
              </Text>
              new cards
            </Text>

            <Text className="text-lg text-neutral-500 font-[Avenir] font-bold">
              <Text className="font-bold text-2xl text-black">
                {finishedStats.revisedCards}{" "}
              </Text>
              revisions
            </Text>
          </View>

          <View className="flex flex-row justify-between">
            <Text className="text-lg text-neutral-500 font-[Avenir] font-bold">
              <Text className="font-bold text-2xl text-black">
                {Math.round(finishedStats.timePerCard / 1000)}s{" "}
              </Text>
              per card
            </Text>
          </View>
        </BlurView>
      </Animated.View>

      <View className="flex-1 flex flex-col justify-start">
        <Animated.View
          className="flex flex-row justify-center"
          style={{
            transform: [{ scale: scaleButton }],
          }}
        >
          <RevisionActionButton onPress={() => router.back()}>
            <Text className="text-lg font-bold font-[Avenir] text-center text-neutral-700">
              Go home
            </Text>

            <Icons.ArrowUTurnLeft
              width={18}
              height={18}
              color={"#4b5563"}
              strokeWidth={2.5}
            />
          </RevisionActionButton>
        </Animated.View>
      </View>
    </View>
  );
}
