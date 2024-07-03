import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  LayoutChangeEvent,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { CardBlocks, Ressource } from "./Memory";
import { CardChoosedContent } from "./chooseCardContent";

export function FlashcardContentComponent({
  cardChoosedContent,
  ressource,
  onDisplayBlur,
  onCardAnswered,
}: {
  cardChoosedContent: CardChoosedContent;
  ressource: Ressource;
  onDisplayBlur: (height: number) => void; // Used on swipable cards
  onCardAnswered: (isRight: boolean) => void; // Used on non-swipable cards
}) {
  const answerRef = useRef<View>(null);

  const handleAnswerWithBlurLayout = (event: LayoutChangeEvent) => {
    if (!answerRef.current) return;

    answerRef.current.measure((x, y, width, height, pageX, pageY) => {
      // Assuming 'pageY' gives us the top position of the Answer relative to the screen
      const screenHeight = Dimensions.get("window").height; // Get the screen height
      const topPosition = pageY;
      const calculatedBlurHeight = screenHeight - topPosition; // Height from answer top to bottom of the screen
      onDisplayBlur(calculatedBlurHeight + 5);
    });
  };

  if (!cardChoosedContent) {
    return <Text>Unsupported card type</Text>;
  }

  const [showTrueAnswer, setShowTrueAnswer] = useState(false); // Used for fake-answer cards

  function handleCardAnswered(isRight: boolean) {
    setShowTrueAnswer(true);
    onCardAnswered(isRight);
  }

  if (cardChoosedContent.type === "classic") {
    if (cardChoosedContent.subtype === "no-complication") {
      return (
        <View className="flex flex-col gap-6 self-stretch">
          <Text className="mx-10 font-[Avenir] font-medium text-xs text-orange-600">
            {ressource.resourceGroup && ressource.resourceGroup.name + " > "}

            {ressource.name}
          </Text>

          <View className="mx-10">
            <CardBlock cardBlocks={cardChoosedContent.question} />
          </View>

          <View
            className="mx-5 px-5 py-4 bg-neutral-200 rounded-2xl"
            onLayout={handleAnswerWithBlurLayout} // Attach layout handler
            ref={answerRef} // Attach ref for measurements
          >
            <CardBlock cardBlocks={cardChoosedContent.answer} />
          </View>
        </View>
      );
    } else if (cardChoosedContent.subtype === "fake-answer") {
      return (
        <View className="flex flex-col gap-6 self-stretch">
          <Text className="mx-10 font-[Avenir] font-medium text-xs text-orange-600">
            {ressource.resourceGroup && ressource.resourceGroup.name + " > "}

            {ressource.name}
          </Text>

          <View className="mx-10">
            <CardBlock cardBlocks={cardChoosedContent.question} />
          </View>

          {/* Grid of answers and fake answers: */}
          <View className="flex flex-col gap-4 mx-6">
            {cardChoosedContent.answerChoices.map((answerChoice, i) => {
              if (i % 2 !== 0) return;

              return (
                <View key={i} className="flex flex-row gap-4">
                  {cardChoosedContent.answerChoices
                    .slice(i, i + 2)
                    .map((answerChoice, e) => {
                      const isTrueAnswer =
                        cardChoosedContent.trueAnswerPos === i + e;

                      return (
                        <AnswerButton
                          key={e}
                          isGoodAnswer={isTrueAnswer}
                          showGoodAnswer={showTrueAnswer}
                          onPress={() => handleCardAnswered(isTrueAnswer)}
                        >
                          <CardBlock
                            cardBlocks={answerChoice}
                            textSize="text-md"
                          />
                        </AnswerButton>
                      );
                    })}
                </View>
              );
            })}
          </View>
        </View>
      );
    }
  } else {
    return <Text>Unsupported card type</Text>;
  }
}

function AnswerButton({
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
          className="flex flex-row justify-center px-4 py-3 rounded-3xl border"
          style={{
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
              outputRange: [0, isGoodAnswer ? 0.5 : 0.2],
            }),
          }}
        >
          {children}
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );
}

function CardBlock({
  cardBlocks,
  textSize = "text-lg",
}: {
  cardBlocks: CardBlocks;
  textSize?: "text-md" | "text-lg";
}) {
  return (
    <View className="flex flex-col gap-2">
      {cardBlocks.map((block, i) => {
        if (typeof block === "string") {
          return (
            <Text
              key={i}
              className={`font-[Avenir] font-medium text-neutral-800 ${textSize}`}
            >
              {block}
            </Text>
          );
        } else {
          return (
            <Text
              key={i}
              className={`font-[Avenir] font-medium text-neutral-800 ${textSize}`}
            >
              Unsupported block type
            </Text>
          );
        }
      })}
    </View>
  );

  /* ### Future webview implementation ###
  <View className="mx-6 border-2 rounded-xl h-72 shrink-0">
    <WebView
      scrollEnabled={false}
      originWhitelist={["*"]}
      source={{
        //html: "<body><h1><center>Hello world</center></h1></body>",
        uri: "https://miniature.earth/demo/world-trip.htm",
      }}
      style={{
        height: "100%",
        width: "100%",
        flex: 1,
        borderRadius: 8,
        backgroundColor: "transparent",
      }}
    />
    <View className="absolute right-0 bottom-0 top-0 left-0 opacity-0 rounded-lg" />
    {/* This disable touch events on webview * /}
  </View> */
}
