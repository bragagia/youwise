import Icons from "@/app/icons";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { useRef, useState } from "react";
import {
  Animated,
  ImageBackground,
  Text,
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

export function FlashcardAnswerBlurComponent({
  onBlurHidden,
  blurHeight,
}: {
  onBlurHidden: () => void;
  blurHeight: number | null;
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
    if (!blurHeight) return;

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
      if (dest === "hide") {
        setHidden(true);
      }
    });
  };

  const onBlurHandlerStateChange = (
    event: HandlerStateChangeEvent<PanGestureHandlerEventPayload>
  ) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      let dest: "hide" | "reset";
      if (
        event.nativeEvent.translationY > 50 ||
        event.nativeEvent.velocityY > 300
      ) {
        dest = "hide";
      } else {
        dest = "reset";
      }

      handleTouchRelease(dest, event.nativeEvent.velocityY);
    }
  };

  if (!blurHeight || hidden) return null;

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
