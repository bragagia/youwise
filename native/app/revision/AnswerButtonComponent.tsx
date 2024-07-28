import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, TouchableWithoutFeedback, View } from "react-native";

export function AnswerButtonComponent({
  children,
  isGoodAnswer,
  showGoodAnswer,
  onPress,
}: {
  children: React.ReactNode;
  isGoodAnswer: boolean;
  showGoodAnswer: boolean;
  onPress: () => void;
}) {
  const [hasBeenPressed, setHasBeenPressed] = useState(false);

  const colorState = useRef(
    new Animated.Value(
      hasBeenPressed || (isGoodAnswer && showGoodAnswer) ? 1 : 0
    )
  ).current;

  const flicker = (delay: number) => {
    if (isGoodAnswer) {
      Animated.sequence([
        Animated.timing(colorState, {
          delay: delay,
          toValue: 1,
          duration: 50,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
        Animated.timing(colorState, {
          toValue: 0,
          duration: 50,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
        Animated.timing(colorState, {
          toValue: 1,
          duration: 100,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
        Animated.timing(colorState, {
          toValue: 0,
          duration: 100,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
        // Continue the flicker sequence as desired
        Animated.spring(colorState, {
          toValue: 1,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      Animated.spring(colorState, {
        toValue: 1,
        useNativeDriver: false,
      }).start();
    }
  };

  const handlePressIn = () => {
    if (showGoodAnswer) return; // Prevent user from pressing on answer after it has been revealed

    setHasBeenPressed(true);
    onPress();

    flicker(0);
  };

  useEffect(() => {
    if (!hasBeenPressed && showGoodAnswer && isGoodAnswer) {
      flicker(400);
    }
  }, [showGoodAnswer, hasBeenPressed]);

  return (
    <View className="grow flex-1">
      <TouchableWithoutFeedback onPress={handlePressIn}>
        <Animated.View
          style={{
            borderWidth: 2,
            borderRadius: 24,
            backgroundColor: colorState.interpolate({
              inputRange: [0, 1],
              outputRange: ["#e5e5e5", isGoodAnswer ? "#bbf7d0" : "#fef2f2"], // bg-neutral-100 bg-green-200 bg-red-50
            }),
            borderColor: colorState.interpolate({
              inputRange: [0, 1],
              outputRange: ["#00000000", isGoodAnswer ? "#15803d" : "#f87171"], // border-transparent border-green-700 border-red-400
            }),
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowRadius: 5,
            shadowColor: isGoodAnswer ? "#22c55e" : "#ef4444",
            shadowOpacity: colorState.interpolate({
              inputRange: [0, 1],
              outputRange: [0, isGoodAnswer ? 0.5 : 0],
            }),
          }}
        >
          <View className="flex flex-row justify-center px-4 py-3">
            {children}
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );
}
