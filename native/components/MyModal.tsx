import { BlurView } from "expo-blur";
import { useEffect, useRef, useState } from "react";
import { Animated } from "react-native";

export function MyModal({
  children,
  open,
}: {
  children: React.ReactNode;
  open: boolean;
}) {
  const opacity = useRef(new Animated.Value(open ? 1 : 0)).current;
  const scale = useRef(new Animated.Value(open ? 1 : 0.8)).current;
  const [hidden, setHidden] = useState(!open);

  useEffect(() => {
    if (open) {
      setHidden(false);

      Animated.parallel([
        Animated.spring(opacity, {
          toValue: 1,
          useNativeDriver: true,
        }),

        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(opacity, {
          toValue: 0,
          restSpeedThreshold: 300,
          useNativeDriver: true,
        }),

        Animated.spring(scale, {
          toValue: 1.2,
          restSpeedThreshold: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setHidden(true);
        scale.setValue(0.8);
      });
    }
  }, [open]);

  if (hidden) return null;

  return (
    <Animated.View
      className="absolute top-0 bottom-0 left-0 right-0 flex flex-row items-center justify-center z-20"
      style={{
        opacity: opacity,
      }}
    >
      <BlurView
        intensity={30}
        tint="systemThickMaterialDark"
        className="flex absolute top-0 bottom-0 left-0 right-0 h-full w-full"
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        }}
      ></BlurView>

      <Animated.View
        className="mx-10 px-8 py-8 rounded-2xl bg-neutral-100"
        style={{
          transform: [
            {
              scale: scale,
            },
          ],
        }}
      >
        {children}
      </Animated.View>
    </Animated.View>
  );
}
