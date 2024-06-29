import Icons from "@/app/icons";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  ImageBackground,
  LayoutChangeEvent,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  GestureEvent,
  HandlerStateChangeEvent,
  PanGestureHandler,
  PanGestureHandlerEventPayload,
  State,
} from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { uuid } from "../../lib/uuid";

type CardImageBlock = {
  type: "image";
  blockId: string;
  imageId: string;
  occludeParts?: {
    x: number;
    y: number;
    width: number;
    height: number;
  }[]; // Those parts will always be occluded, even when the answer is shown. This is useful for hiding other cards answers in the image
};

type CardBlockPrimitive = string | CardImageBlock;
type CardBlock = CardBlockPrimitive[];

type ClassicCardOcclusionText = {
  type: "text";
  value: string;
};
// ClassicCardOcclusionBlock are used to hide a whole block
type ClassicCardOcclusionBlock = {
  type: "block";
  blockId: string;
  blockImageSection?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
};

type ClassicCardOcclusionsComplication = {
  occlusions: (ClassicCardOcclusionText | ClassicCardOcclusionBlock)[]; // Answer will be hidden behind occlusions
};
type ClassicCardFakeAnswerComplication = {
  fakeAnswers: CardBlock[]; // Answer will be presented sometimes as a quizz, sometimes as a hidden answer (always will be presented as quizz on first presentation)
};

// ClassicCardValue are used to memorize standalone facts
type ClassicCardValue = {
  type: "classic";
  variants: {
    question?: CardBlock; // There can be no question if the card use occlusions in the answer
    answer: CardBlock;
    answerComplication?:
      | ClassicCardOcclusionsComplication
      | ClassicCardFakeAnswerComplication;
  }[];
};

type TextCardLine = {
  id: string; // Unique ID to identify the part
  part: CardBlock; // Must be smart cut by AI to be at least multiple words but not more than 6 (to be less than 7 items of short memory limit)
}[];

// TextCardValue are used to memorize long texts or quote by heart
type TextCardValue = {
  type: "text";
  title: CardBlock;
  text: TextCardLine[];
};

type CardValue = ClassicCardValue | TextCardValue;

type Memory = {
  id: string;
  card: {
    resource: {
      name: string;
      resourceGroup?: {
        name: string;
      };
    };
    value: CardValue;
  };
  memoryStatus: "new" | "review" | "forgotten";
  partsMemory?: {
    id: string;
    memoryStatus: "new" | "review" | "forgotten";
  }[]; // Used to store the memory status of each part of the card (for text cards)
};

const memories: Memory[] = [
  {
    id: uuid(),
    card: {
      resource: {
        name: "SF",
        resourceGroup: {
          name: "Culture geek",
        },
      },

      value: {
        type: "classic",
        variants: [
          {
            question: [
              "What is the answer to life, the universe, and everything?",
            ],
            answer: ["42"],
          },
        ],
      },
    },

    memoryStatus: "new",
  },
  {
    id: uuid(),
    card: {
      resource: {
        name: "SF",
        resourceGroup: {
          name: "Culture geek",
        },
      },

      value: {
        type: "classic",
        variants: [
          {
            question: ["What is AlphaGo?"],
            answer: ["A computer program that plays the board game Go."],
          },
        ],
      },
    },

    memoryStatus: "new",
  },
];

// Entry point for the app
const Ressource = () => {
  const insets = useSafeAreaInsets();

  const [revisionHasStarted, setRevisionHasStarted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setRevisionHasStarted(true); // Allow to to let the first card load before actually displaying it
    }, 200);

    return () => {
      clearTimeout(timeout);
    };
  });

  const circleScale = useRef(new Animated.Value(0)).current;
  const circleOpacity = useRef(new Animated.Value(0)).current;

  const [displayedMemories, setDisplayedMemories] = useState<Memory[]>([
    memories[0],
    memories[1],
  ]);
  const prevMemory =
    displayedMemories.length === 3 ? displayedMemories[0] : null;
  const currentMemory = displayedMemories[displayedMemories.length - 2];
  const nextMemory = displayedMemories[displayedMemories.length - 1];

  const [progress, setProgress] = useState(0);
  const progressAnimated = useRef(new Animated.Value(0)).current;

  const onCardSwiped = (direction: "left" | "right") => {
    setTimeout(() => {
      setDisplayedMemories([
        currentMemory, // New prev
        nextMemory, // New current
        { ...currentMemory, id: uuid() }, // New next
      ]); // TODO:

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
    }, 100);
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
          isVisible={revisionHasStarted}
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

function FlashcardComponent({
  memory,
  isVisible,
  onCardSwiped,
}: {
  memory: Memory;
  isVisible: boolean;
  onCardSwiped: (direction: "left" | "right") => void;
}) {
  const [blurHeight, setBlurHeight] = useState(900); // Initial state for blur height
  const [isTouchable, setIsTouchable] = useState(false);

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

  const tadaOpacity = useRef(new Animated.Value(0)).current;
  const tadaScale = tadaOpacity;

  const cryingOpacity = useRef(new Animated.Value(0)).current;
  const cryingScale = cryingOpacity;

  const onCardGestureEvent = (
    event: GestureEvent<PanGestureHandlerEventPayload>
  ) => {
    if (!isTouchable) return;

    cardTranslateX.setValue(event.nativeEvent.translationX);
    cardTranslateY.setValue(event.nativeEvent.translationY);
    tadaOpacity.setValue(Math.min(1, event.nativeEvent.translationX / 100));
    cryingOpacity.setValue(Math.min(1, -event.nativeEvent.translationX / 100));
  };

  const handleTouchRelease = (
    direction: "right" | "left" | undefined,
    initialVelocity = 0
  ) => {
    if (!isTouchable) return;

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

      if (event.nativeEvent.translationX > 15) {
        newCardSwipeDirection = "right";
      } else if (event.nativeEvent.translationX < -15) {
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

  return (
    <Animated.View
      className="absolute top-0 flex flex-col justify-center w-full h-full"
      pointerEvents={isVisible ? "auto" : "none"}
      style={{
        opacity: isVisible ? cardOpacity : 0,
        transform: [{ scale: scale }],
      }}
    >
      <View className="flex flex-col justify-center w-full gap-6 shadow grow">
        <View className="grow" />

        <PanGestureHandler
          onGestureEvent={onCardGestureEvent}
          onHandlerStateChange={onCardHandlerStateChange}
        >
          <Animated.View
            className="mx-10 rounded-xl bg-white pt-8 pb-6 self-stretch overflow-hidden z-20"
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
            <Animated.Image
              source={Icons.Tada}
              className="absolute left-4 top-2 h-40 w-40 z-50 origin-top-left bg-white"
              style={{
                opacity: tadaOpacity,
                transform: [
                  {
                    scale: tadaScale,
                  },
                ],
              }}
              alt="Tada"
            />

            <Animated.Image
              source={Icons.LoudlyCryingFace}
              className="absolute right-4 top-2 h-40 w-40 z-50 origin-top-right bg-white"
              style={{
                opacity: cryingOpacity,
                transform: [
                  {
                    scale: cryingScale,
                  },
                ],
              }}
              alt="Crying face"
            />

            <FlashcardContentComponent
              onAnswerPositionLayout={setBlurHeight}
              memory={memory}
            />
          </Animated.View>
        </PanGestureHandler>

        <Animated.View
          className="px-4 flex flex-row justify-between z-0 grow"
          style={{
            opacity: helpersOpacity,
          }}
        >
          <TouchableWithoutFeedback onPress={() => handleTouchRelease("left")}>
            <View className="flex flex-row items-start grow">
              <View className="flex flex-row items-center gap-1 opacity-50">
                <Icons.ArrowArcLeft width={15} height={15} color="black" />
                <Text className="text-xs font-[Avenir]">
                  {"Forgotten?\nTap or swipe left"}
                </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={() => handleTouchRelease("right")}>
            <View className="flex flex-row justify-end items-start grow">
              <View className="flex flex-row items-center gap-1 opacity-50">
                <Text className="text-xs font-[Avenir] text-right">
                  {"Perfect recall?\nTap or swipe right"}
                </Text>
                <Icons.ArrowArcRight width={15} height={15} color="black" />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </View>

      <FlashcardAnswerBlurComponent
        blurHeight={blurHeight}
        onBlurHidden={() => setIsTouchable(true)}
      />
    </Animated.View>
  );
}

function FlashcardContentComponent({
  memory,
  onAnswerPositionLayout,
}: {
  memory: Memory;
  onAnswerPositionLayout: (height: number) => void;
}) {
  const webViewRef = useRef<View>(null); // Ref to attach to the WebView container for measurements

  const handleWebViewLayout = (event: LayoutChangeEvent) => {
    if (!webViewRef.current) return;

    const layout = event.nativeEvent.layout;
    webViewRef.current.measure((x, y, width, height, pageX, pageY) => {
      // Calculate blur height based on the WebView's position
      // Assuming 'pageY' gives us the top position of the WebView relative to the screen
      const screenHeight = Dimensions.get("window").height; // Get the screen height
      const topPosition = pageY; // Top position of the WebView
      const calculatedBlurHeight = screenHeight - topPosition; // Height from WebView top to bottom of the screen
      onAnswerPositionLayout(calculatedBlurHeight + 5);
    });
  };

  return (
    <View className="flex flex-col gap-6 self-stretch">
      <Text className="mx-10 font-[Avenir] font-medium text-xs text-orange-600">
        {memory.question.resource.resourceGroup &&
          memory.question.resource.resourceGroup.name + " > "}

        {memory.question.resource.name}
      </Text>

      <Text className="mx-10 font-[Avenir] font-medium text-lg text-gray-800">
        {memory.question.question}
      </Text>

      <View
        className="mx-6 px-4 py-3 border-2 border-black rounded-xl"
        onLayout={handleWebViewLayout} // Attach layout handler
        ref={webViewRef} // Attach ref for measurements
      >
        <Text className="font-[Avenir] font-bold text-lg text-black">
          {memory.question.answer}
        </Text>
      </View>

      {/* ### Future webview implementation ###
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
      </View> */}
    </View>
  );
}

function FlashcardAnswerBlurComponent({
  onBlurHidden,
  blurHeight,
}: {
  onBlurHidden: () => void;
  blurHeight: number;
}) {
  const [hidden, setHidden] = useState(false);

  // Blur animation
  const blurTranslateY = useRef(new Animated.Value(0)).current;

  const onBlurGestureEvent = (
    event: GestureEvent<PanGestureHandlerEventPayload>
  ) => {
    blurTranslateY.setValue(Math.max(0, event.nativeEvent.translationY));
  };

  const handleTouchRelease = (dest: "reset" | "hide", initialVelocity = 0) => {
    let newTranslateY = 0;
    if (dest === "hide") {
      newTranslateY = blurHeight;
      onBlurHidden();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    Animated.spring(blurTranslateY, {
      toValue: newTranslateY,
      velocity: Math.max(0, initialVelocity), // Prevent going up on swipe up
      useNativeDriver: true,
    }).start(() => {
      setHidden(true);
    });
  };

  const onBlurHandlerStateChange = (
    event: HandlerStateChangeEvent<PanGestureHandlerEventPayload>
  ) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const dest = event.nativeEvent.translationY > 15 ? "hide" : "reset";

      handleTouchRelease(dest, event.nativeEvent.velocityY);
    }
  };

  return (
    <PanGestureHandler
      onGestureEvent={onBlurGestureEvent}
      onHandlerStateChange={onBlurHandlerStateChange}
    >
      <Animated.View
        style={{
          transform: [{ translateY: blurTranslateY }],
          height: blurHeight,
          bottom: 0,
        }}
        className="absolute w-full shadow-xl"
      >
        <View className="absolute w-full h-full rounded-t-xl overflow-hidden">
          <TouchableWithoutFeedback onPress={() => handleTouchRelease("hide")}>
            <BlurView
              className="w-full h-full flex items-center justify-center gap-4"
              intensity={70}
              tint="systemMaterialLight"
            >
              <ImageBackground
                source={require("@/assets/images/noise-strong.png")}
                className="w-full h-full absolute"
                resizeMode="repeat"
              />

              <Text className="opacity-0 text-xs"> </Text>

              <View className="h-10 w-10 opacity-30">
                <Icons.ArrowDown />
              </View>

              <Text className="opacity-40 text-md font-bold font-[Avenir]">
                Tap or swipe down to reveal answer
              </Text>
            </BlurView>
          </TouchableWithoutFeedback>
        </View>
      </Animated.View>
    </PanGestureHandler>
  );
}
