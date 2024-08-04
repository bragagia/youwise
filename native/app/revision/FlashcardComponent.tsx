import { CardChoosenContent } from "@/app/revision/CardChoosenContent";
import { FlashcardAnswerBlurComponent } from "@/app/revision/FlashcardAnswerBlurComponent";
import { RevisingMemory } from "@/app/revision/MemoryBeingRevised";
import { RevisionActionButton } from "@/app/revision/RevisionActionButton";
import Icons from "@/components/Icons";
import { useHaptics } from "@/lib/haptics";
import { ImpactFeedbackStyle, NotificationFeedbackType } from "expo-haptics";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Text, TouchableWithoutFeedback, View } from "react-native";
import {
  GestureEvent,
  HandlerStateChangeEvent,
  PanGestureHandler,
  PanGestureHandlerEventPayload,
  State,
} from "react-native-gesture-handler";
import { chooseCardContent } from "./chooseCardContent";
import { FlashcardContentComponent } from "./FlashcardContentComponent";

export function FlashcardComponent({
  revisingMemory,
  isVisible,
  onCardSwiped,
}: {
  revisingMemory: RevisingMemory;
  isVisible: boolean;
  onCardSwiped: (direction: "left" | "right") => void;
}) {
  const haptics = useHaptics();
  const scale = useRef(new Animated.Value(1)).current; // We actually start at 1 instead of zero to allow correct calculation of blur position

  const [cardChoosedContent] = useState(() => {
    return chooseCardContent(revisingMemory);
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

  const footerOpacity = cardTranslateX.interpolate({
    inputRange: [-100, 0, 100],
    outputRange: [0, 1, 0],
  });

  const [isContinueButtonClickable, setIsContinueButtonClickable] =
    useState(false);

  const tadaOpacity = useRef(new Animated.Value(0)).current;
  const cryingOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isVisible) return;

    // Animate in when the component mounts or memory changes
    scale.setValue(0);

    Animated.spring(scale, {
      toValue: 1, // Animate to normal position
      useNativeDriver: true,
    }).start();
  }, [isVisible, scale]);

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

  const onCardGestureStateChange = (
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
      haptics.notificationAsync(NotificationFeedbackType.Success);
    } else if (direction === "left") {
      destX = -cardTranslateXMax;
      haptics.impactAsync(ImpactFeedbackStyle.Light);
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

  const handleCardAnswered = (isRightAnswer: boolean) => {
    if (isRightAnswer) {
      haptics.notificationAsync(NotificationFeedbackType.Success);

      setTimeout(() => handleTouchRelease("right"), 600);
    } else {
      haptics.impactAsync(ImpactFeedbackStyle.Light);

      setIsContinueButtonClickable(true);
    }
  };

  let cardHasShadow: boolean = false;
  if (
    cardChoosedContent.type === "classic" &&
    cardChoosedContent.subtype === "no-complication"
  ) {
    cardHasShadow = true; // Only swipable card has shadow
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
          onHandlerStateChange={onCardGestureStateChange}
        >
          <Animated.View
            style={{
              transform: [
                { translateX: cardTranslateX },
                { translateY: cardTranslateY },
                {
                  rotate: cardRotation,
                },
              ],
            }}
          >
            <View
              className="mx-10 rounded-xl bg-white pt-8 pb-6 self-stretch z-20"
              style={{
                shadowColor: cardHasShadow ? "#000" : "transparent",
                shadowOffset: {
                  width: 0,
                  height: 6,
                },
                shadowOpacity: 0.25,
                shadowRadius: 8,
              }}
            >
              <View className="absolute left-4 top-2 z-50 pointer-events-none">
                <Animated.Image
                  source={Icons.Tada}
                  style={{
                    height: 160,
                    width: 160,
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
              </View>

              <View className="absolute right-4 top-2 z-50 pointer-events-none">
                <Animated.Image
                  source={Icons.LoudlyCryingFace}
                  style={{
                    height: 160,
                    width: 160,
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
              </View>

              <FlashcardContentComponent
                onDisplayBlur={setBlurHeight}
                cardChoosedContent={cardChoosedContent}
                ressource={revisingMemory.resource}
                onCardAnswered={handleCardAnswered}
              />
            </View>
          </Animated.View>
        </PanGestureHandler>

        <Animated.View
          className="flex-1 grow flex flex-col"
          style={{
            opacity: footerOpacity,
          }}
        >
          <Footer
            cardChoosedContent={cardChoosedContent}
            isTouchable={isTouchable}
            isContinueButtonClickable={isContinueButtonClickable}
            handleTouchRelease={handleTouchRelease}
          />
        </Animated.View>
      </View>

      <FlashcardAnswerBlurComponent
        blurHeight={blurHeight}
        onBlurHidden={() => setIsTouchable(true)}
      />
    </Animated.View>
  );
}

function Footer({
  cardChoosedContent,
  isTouchable,
  isContinueButtonClickable,
  handleTouchRelease,
}: {
  cardChoosedContent: CardChoosenContent;
  isTouchable: boolean;
  isContinueButtonClickable: boolean;
  handleTouchRelease: (direction: "right" | "left") => void;
}) {
  const continueButtonOpacity = useRef(
    new Animated.Value(isContinueButtonClickable ? 1 : 0)
  ).current;

  let footerType: "none" | "swipable" | "continue-button" = "none";
  if (
    cardChoosedContent.type === "classic" &&
    cardChoosedContent.subtype === "no-complication"
  ) {
    footerType = "swipable";
  } else if (
    cardChoosedContent.type === "classic" &&
    cardChoosedContent.subtype === "fake-answer"
  ) {
    footerType = "continue-button";
  }

  useEffect(() => {
    if (isContinueButtonClickable) {
      Animated.spring(continueButtonOpacity, {
        toValue: 1,
        delay: 600,
        useNativeDriver: true,
      }).start();
    }
  }, [isContinueButtonClickable]);

  if (footerType === "swipable") {
    return (
      <Animated.View className="px-4 flex flex-row justify-between z-0 grow">
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
    );
  }

  if (footerType === "continue-button") {
    return (
      <Animated.View
        className="flex flex-row justify-center"
        style={{
          opacity: continueButtonOpacity,
        }}
      >
        <RevisionActionButton
          onPress={() =>
            isContinueButtonClickable && handleTouchRelease("left")
          }
        >
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
    );
  }

  return <></>;
}
