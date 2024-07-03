import Icons from "@/app/icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  ImageBackground,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FlashcardComponent } from "./FlashcardComponent";
import { RevisionStatsCard } from "./RevisionStatsCard";
import { useLocalRevisionEngine } from "./useLocalRevisionEngine";

const Ressource = () => {
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(true); // Allow to to let the first card load before actually displaying it
    }, 200);

    return () => {
      clearTimeout(timeout);
    };
  });

  const circleScale = useRef(new Animated.Value(0)).current;
  const circleOpacity = useRef(new Animated.Value(0)).current;

  const prevBackgroundOpacity = useRef(new Animated.Value(0)).current;

  const {
    prevMemory,
    currentMemory,
    nextMemory,
    progress,
    finishedStats,
    swipeCard,
  } = useLocalRevisionEngine();

  const progressAnimated = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(progressAnimated, {
      toValue: progress,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const onCardSwiped = (direction: "left" | "right") => {
    setTimeout(() => {
      swipeCard(direction);

      if (direction === "right") {
        circleScale.setValue(0);
        circleOpacity.setValue(1);

        Animated.parallel([
          Animated.spring(circleScale, {
            toValue: 1,
            useNativeDriver: true,
          }),
          Animated.spring(circleOpacity, {
            toValue: 0,
            useNativeDriver: true,
          }),
        ]).start();
      }
    }, 100); // Timeout is there to allow the swipe card to be animated before the new card start to appear
  };

  useEffect(() => {
    prevBackgroundOpacity.setValue(1);

    Animated.timing(prevBackgroundOpacity, {
      toValue: 0,
      duration: 301,
      useNativeDriver: true,
    }).start();
  }, [prevMemory]);

  const prevMemoryTint = prevMemory?.memory.card.resource.tint;
  const currentMemoryTint = currentMemory?.memory.card.resource.tint;

  return (
    <View className="min-h-full">
      {/* Default background that will only be visible on stat screen */}
      <LinearGradient
        colors={[`hsl(${30}, 90%, 50%)`, `hsl(${(30 + 235) % 255}, 90%, 60%)`]}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        }}
      />

      {currentMemoryTint && (
        <View
          key={currentMemory.key}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
          }}
        >
          <LinearGradient
            colors={[
              `hsl(${currentMemoryTint}, 90%, 50%)`,
              `hsl(${(currentMemoryTint + 235) % 255}, 90%, 60%)`,
            ]}
            //colors={["rgb(163 163 163)", "rgb(82 82 82)"]}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
            }}
          />
        </View>
      )}

      {prevMemoryTint && (
        <Animated.View
          key={prevMemory.key}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            opacity: prevBackgroundOpacity,
          }}
        >
          <LinearGradient
            colors={[
              `hsl(${prevMemoryTint}, 90%, 50%)`,
              `hsl(${(prevMemoryTint + 235) % 255}, 90%, 60%)`,
            ]}
            //colors={["rgb(163 163 163)", "rgb(82 82 82)"]}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
            }}
          />
        </Animated.View>
      )}

      <ImageBackground
        source={require("@/assets/images/noise-strong.png")}
        className="w-full h-full absolute"
        resizeMode="repeat"
      />

      <View
        style={{
          marginTop: insets.top,
        }}
        className="absolute grow w-full bottom-0 top-0"
      >
        {!finishedStats && (
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute right-2 top-4 h-14 w-14 z-20 p-4"
          >
            <Icons.Pause />
          </TouchableOpacity>
        )}

        <View className="absolute top-1 h-2 flex flex-row left-2 right-2 rounded-full">
          <View className="absolute h-full w-full bg-black opacity-15 z-40 rounded-full" />

          <Animated.View
            className="h-full bg-white rounded-full z-50"
            style={{
              width: progressAnimated.interpolate({
                inputRange: [0, 1],
                outputRange: ["0%", "100%"],
              }),
            }}
          >
            <Animated.View
              className="absolute right-0 -mt-8 -mr-8 h-16 w-16 bg-white rounded-full z-50"
              style={{
                transform: [{ scale: circleScale }],
                opacity: circleOpacity,
              }}
            />
          </Animated.View>
        </View>

        {prevMemory && (
          <FlashcardComponent
            key={prevMemory.key}
            onCardSwiped={onCardSwiped}
            memoryBeingRevised={prevMemory}
            isVisible={true}
          />
        )}

        {currentMemory && (
          <FlashcardComponent
            key={currentMemory.key}
            onCardSwiped={onCardSwiped}
            memoryBeingRevised={currentMemory}
            isVisible={loading}
          />
        )}

        {nextMemory && (
          <FlashcardComponent
            key={nextMemory.key}
            onCardSwiped={onCardSwiped}
            memoryBeingRevised={nextMemory}
            isVisible={false}
          />
        )}

        {finishedStats && <RevisionStatsCard finishedStats={finishedStats} />}
      </View>
    </View>
  );
};

export default Ressource;
