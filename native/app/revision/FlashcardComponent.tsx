import Icons from "@/app/icons";
import { FlashcardAnswerBlurComponent } from "@/app/revision/FlashcardAnswerBlurComponent";
import { RevisionActionButton } from "@/app/revision/RevisionActionButton";
import * as Haptics from "expo-haptics";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Text, TouchableWithoutFeedback, View } from "react-native";
import {
  GestureEvent,
  HandlerStateChangeEvent,
  PanGestureHandler,
  PanGestureHandlerEventPayload,
  State,
} from "react-native-gesture-handler";
import { FlashcardContentComponent } from "./FlashcardContentComponent";
import { MemoryBeingRevised } from "./Memory";
import { chooseCardContent } from "./chooseCardContent";

export function FlashcardComponent({
  memoryBeingRevised,
  isVisible,
  onCardSwiped,
}: {
  memoryBeingRevised: MemoryBeingRevised;
  isVisible: boolean;
  onCardSwiped: (direction: "left" | "right") => void;
}) {
  const [cardChoosedContent] = useState(() => {
    return chooseCardContent(memoryBeingRevised);
  });

  const [blurHeight, setBlurHeight] = useState<number | null>(null);
  const [isTouchable, setIsTouchable] = useState(false); // Card become touchable when blur is defined or for some cardChoosedContent

  const cardTranslateXMax = 400;
  const cardTranslateX = useRef(new Animated.Value(0)).current;
  const cardTranslateY = useRef(new Animated.Value(0)).current;
  const cardRotation = cardTranslateX.interpolate({
    inputRange: [-400, 0, 400],
    outputRange: ["-20deg", "0deg", "20deg"],
  });
  const cardOpacity = cardTranslateX.interpolate({
    inputRange: [-cardTranslateXMax, -100, 0, 100, cardTranslateXMax],
    outputRange: [0, 1, 1, 1, 0],
  });

  const helpersOpacity = cardTranslateX.interpolate({
    inputRange: [-100, 0, 100],
    outputRange: [0, 1, 0],
  });

  const continueButtonOpacity = useRef(new Animated.Value(0)).current;
  const [continueButtonClickable, setContinueButtonClickable] = useState(false);

  const tadaOpacity = useRef(new Animated.Value(0)).current;
  const cryingOpacity = useRef(new Animated.Value(0)).current;

  const onCardGestureEvent = (
    event: GestureEvent<PanGestureHandlerEventPayload>
  ) => {
    if (!isTouchable) return;

    cardTranslateX.setValue(event.nativeEvent.translationX);
    cardTranslateY.setValue(event.nativeEvent.translationY);
    tadaOpacity.setValue(
      Math.max(0, Math.min(1, event.nativeEvent.translationX / 100))
    );
    cryingOpacity.setValue(
      Math.max(0, Math.min(1, -event.nativeEvent.translationX / 100))
    );
  };

  const handleTouchRelease = (
    direction: "right" | "left" | undefined,
    initialVelocity = 0
  ) => {
    if (direction !== undefined) {
      onCardSwiped(direction);
      setIsTouchable(false);
    }

    let destX = 0;
    if (direction === "right") {
      destX = cardTranslateXMax;
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else if (direction === "left") {
      destX = -cardTranslateXMax;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    if (direction === undefined) {
      Animated.spring(cardTranslateX, {
        toValue: destX,
        velocity: initialVelocity,
        useNativeDriver: true,
      }).start();

      Animated.spring(cardTranslateY, {
        toValue: 0,
        useNativeDriver: true,
      }).start();

      Animated.spring(tadaOpacity, {
        toValue: 0,
        useNativeDriver: true,
      }).start();

      Animated.spring(cryingOpacity, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    } else {
      let delay = 0;
      if (initialVelocity === 0) {
        delay = 100;

        // If no velocity, it means that the user tapped instead of swiping
        if (direction === "right") {
          Animated.spring(tadaOpacity, {
            toValue: 1,
            useNativeDriver: true,
          }).start();
        } else {
          Animated.spring(cryingOpacity, {
            toValue: 1,
            useNativeDriver: true,
          }).start();
        }
      }

      Animated.spring(cardTranslateX, {
        toValue: destX,
        velocity: initialVelocity,
        useNativeDriver: true,
        delay: delay,
      }).start();
    }
  };

  const onCardHandlerStateChange = (
    event: HandlerStateChangeEvent<PanGestureHandlerEventPayload>
  ) => {
    if (event.nativeEvent.oldState === State.ACTIVE && isTouchable) {
      let newCardSwipeDirection: "left" | "right" | undefined;

      if (
        event.nativeEvent.translationX > 50 ||
        event.nativeEvent.velocityX > 300
      ) {
        newCardSwipeDirection = "right";
      } else if (
        event.nativeEvent.translationX < -50 ||
        event.nativeEvent.velocityX < -300
      ) {
        newCardSwipeDirection = "left";
      }

      handleTouchRelease(newCardSwipeDirection, event.nativeEvent.velocityX);
    }
  };

  const scale = useRef(new Animated.Value(1)).current; // We actually start at 1 instead of zero to allow correct calculation of blur position

  useEffect(() => {
    if (!isVisible) return;

    // Animate in when the component mounts or memory changes
    scale.setValue(0);

    Animated.spring(scale, {
      toValue: 1, // Animate to normal position
      useNativeDriver: true,
    }).start();
  }, [isVisible, scale]);

  const handleCardAnswered = (isRightAnswer: boolean) => {
    if (isRightAnswer) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      setTimeout(() => handleTouchRelease("right"), 600);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      setContinueButtonClickable(true);

      Animated.spring(continueButtonOpacity, {
        toValue: 1,
        delay: 600,
        useNativeDriver: true,
      }).start();
    }
  };

  let footerType: "none" | "swipable" | "continue-button" = "none";
  let cardHasShadow: boolean = false;
  if (
    cardChoosedContent.type === "classic" &&
    cardChoosedContent.subtype === "no-complication"
  ) {
    footerType = "swipable";
    cardHasShadow = true;
  } else if (
    cardChoosedContent.type === "classic" &&
    cardChoosedContent.subtype === "fake-answer"
  ) {
    footerType = "continue-button";
    cardHasShadow = false;
  }

  return (
    <Animated.View
      className="absolute top-0 flex flex-col justify-center w-full h-full"
      pointerEvents={isVisible ? "auto" : "none"}
      style={{
        opacity: isVisible ? cardOpacity : 0,
        transform: [{ scale: scale }],
      }}
    >
      <View className="flex flex-col justify-center w-full gap-6 grow">
        <View className="grow flex-1" />

        <PanGestureHandler
          onGestureEvent={onCardGestureEvent}
          onHandlerStateChange={onCardHandlerStateChange}
        >
          <Animated.View
            className="mx-10 rounded-xl bg-white pt-8 pb-6 self-stretch z-20"
            style={{
              transform: [
                { translateX: cardTranslateX },
                { translateY: cardTranslateY },
                {
                  rotate: cardRotation,
                },
              ],
              shadowColor: cardHasShadow ? "#000" : "transparent",
              shadowOffset: {
                width: 0,
                height: 6,
              },
              shadowOpacity: 0.25,
              shadowRadius: 8,
            }}
          >
            <Animated.Image
              source={Icons.Tada}
              className="absolute left-4 top-2 h-40 w-40 z-50"
              style={{
                transform: [
                  {
                    scale: tadaOpacity.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.6, 1],
                    }),
                  },
                ],
                opacity: tadaOpacity,
              }}
              alt="Tada"
            />

            <Animated.Image
              source={Icons.LoudlyCryingFace}
              className="absolute right-4 top-2 h-40 w-40 z-50"
              style={{
                transform: [
                  {
                    scale: cryingOpacity.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.6, 1],
                    }),
                  },
                ],
                opacity: cryingOpacity,
              }}
              alt="Crying face"
            />

            <FlashcardContentComponent
              onDisplayBlur={setBlurHeight}
              cardChoosedContent={cardChoosedContent}
              ressource={memoryBeingRevised.memory.card.resource}
              onCardAnswered={handleCardAnswered}
            />
          </Animated.View>
        </PanGestureHandler>

        {footerType === "swipable" && (
          <Animated.View
            className="px-4 flex flex-row justify-between z-0 grow flex-1"
            style={{
              opacity: helpersOpacity,
            }}
          >
            <TouchableWithoutFeedback
              onPress={() => isTouchable && handleTouchRelease("left")}
            >
              <View className="flex flex-row items-start grow">
                <View className="flex flex-row items-center gap-1 opacity-50">
                  <Icons.ArrowArcLeft width={15} height={15} color="black" />

                  <Text className="text-xs font-medium font-[Avenir]">
                    {"Forgotten?\nTap or swipe left"}
                  </Text>
                </View>
              </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback
              onPress={() => isTouchable && handleTouchRelease("right")}
            >
              <View className="flex flex-row justify-end items-start grow">
                <View className="flex flex-row items-center gap-1 opacity-50">
                  <Text className="text-xs font-medium font-[Avenir] text-right">
                    {"Perfect recall?\nTap or swipe right"}
                  </Text>

                  <Icons.ArrowArcRight width={15} height={15} color="black" />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Animated.View>
        )}

        {footerType === "continue-button" && (
          <Animated.View
            className="flex flex-row grow justify-center flex-1"
            style={{
              opacity: helpersOpacity,
            }}
          >
            <Animated.View
              style={{
                opacity: continueButtonOpacity,
              }}
            >
              <RevisionActionButton onPress={() => handleTouchRelease("left")}>
                <Text className="text-lg font-bold font-[Avenir] text-center text-neutral-700">
                  Continue
                </Text>

                <Icons.ChevronRight
                  width={18}
                  height={18}
                  color={"#4b5563"}
                  strokeWidth={2.5}
                />
              </RevisionActionButton>
            </Animated.View>
          </Animated.View>
        )}

        {footerType === "none" && <View className="grow flex-1" />}
      </View>

      <FlashcardAnswerBlurComponent
        blurHeight={blurHeight}
        onBlurHidden={() => setIsTouchable(true)}
      />
    </Animated.View>
  );
}
