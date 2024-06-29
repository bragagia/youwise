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

  const [progress, setProgress] = useState(0);
  const progressAnimated = useRef(new Animated.Value(0)).current;

  const { prevMemory, currentMemory, nextMemory, swipeCard } =
    useLocalRevisionEngine();

  const onCardSwiped = (direction: "left" | "right") => {
    setTimeout(() => {
      swipeCard(direction);

      if (direction === "right") {
        setProgress((progress + 0.1) % 1); // TODO:

        Animated.spring(progressAnimated, {
          toValue: progress + 0.1,
          useNativeDriver: false,
        }).start();

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

  return (
    <View className="min-h-full">
      <LinearGradient
        colors={["rgb(251 146 60)", "rgb(255 97 69)"]}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        }}
      />

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
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute right-2 top-4 h-14 w-14 z-20 p-4"
        >
          <Icons.Pause />
        </TouchableOpacity>

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
            key={prevMemory.id}
            onCardSwiped={onCardSwiped}
            memory={prevMemory}
            isVisible={true}
          />
        )}

        <FlashcardComponent
          key={currentMemory.id}
          onCardSwiped={onCardSwiped}
          memory={currentMemory}
          isVisible={loading}
        />

        {nextMemory && (
          <FlashcardComponent
            key={nextMemory.id}
            onCardSwiped={onCardSwiped}
            memory={nextMemory}
            isVisible={false}
          />
        )}
      </View>
    </View>
  );
};

export default Ressource;
