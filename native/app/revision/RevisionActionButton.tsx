import { BlurView } from "expo-blur";
import React from "react";
import { TouchableOpacity, View } from "react-native";

export function RevisionActionButton({
  children,
  onPress,
}: {
  children: React.ReactNode[];
  onPress: () => void;
}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        className="rounded-full overflow-hidden bg-neutral-100"
        style={{
          backgroundColor: "rgba(245, 245, 245, 0.6)", // bg-neutral-100
        }}
      >
        <BlurView className="flex flex-row items-center gap-2 py-3 px-6">
          {children}
        </BlurView>
      </View>
    </TouchableOpacity>
  );
}
