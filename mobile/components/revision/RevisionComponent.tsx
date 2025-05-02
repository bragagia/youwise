import Icons from "@/components/Icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  ImageBackground,
  Platform,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FlashcardComponent } from "./FlashcardComponent";
import { RevisionStatsCard } from "./RevisionStatsCard";
import { RevisingMemory } from "@/lib/revision/memoryBeingRevised";
import { useLocalRevisionEngine } from "@/lib/revision/useLocalRevisionEngine";

const RevisionComponent = ({
  revisionDeck,
}: {
  revisionDeck: RevisingMemory[];
}) => {
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
  } = useLocalRevisionEngine(revisionDeck);

  const progressAnimated = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(progressAnimated, {
      toValue: progress,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const onCardSwiped = (direction: "left" | "right") => {
    setTimeout(async () => {
      await swipeCard(direction);

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
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [prevMemory]);

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

      {currentMemory ? (
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
              `hsl(${currentMemory.resource.tint}, 90%, 50%)`,
              `hsl(${(currentMemory.resource.tint + 340) % 360}, 90%, 60%)`,
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
      ) : null}

      {prevMemory ? (
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
              `hsl(${prevMemory.resource.tint}, 90%, 50%)`,
              `hsl(${(prevMemory.resource.tint + 235) % 255}, 90%, 60%)`,
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
      ) : null}

      {Platform.OS === "ios" ? (
        <ImageBackground
          source={require("@/assets/images/noise-strong.png")}
          className="w-full h-full absolute"
          resizeMode="repeat"
        />
      ) : null}

      <View
        style={{
          marginTop: Math.max(6, insets.top),
        }}
        className="absolute grow w-full bottom-0 top-0"
      >
        {!finishedStats ? (
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute right-2 top-4 h-14 w-14 z-20 p-4"
          >
            <Icons.Pause />
          </TouchableOpacity>
        ) : null}

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

        {prevMemory ? (
          <FlashcardComponent
            key={prevMemory.key}
            onCardSwiped={onCardSwiped}
            revisingMemory={prevMemory}
            isVisible={true}
          />
        ) : null}

        {currentMemory ? (
          <FlashcardComponent
            key={currentMemory.key}
            onCardSwiped={onCardSwiped}
            revisingMemory={currentMemory}
            isVisible={loading}
          />
        ) : null}

        {nextMemory ? (
          <FlashcardComponent
            key={nextMemory.key}
            onCardSwiped={onCardSwiped}
            revisingMemory={nextMemory}
            isVisible={false}
          />
        ) : null}

        {finishedStats ? (
          <RevisionStatsCard finishedStats={finishedStats} />
        ) : null}
      </View>
    </View>
  );
};

export default RevisionComponent;
