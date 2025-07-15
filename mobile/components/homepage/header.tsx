import Icons from "@/components/Icons";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function HomepageHeader() {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingTop: Math.max(6, insets.top),
        paddingLeft: Math.max(12, insets.left),
        paddingRight: Math.max(12, insets.right),
        paddingBottom: 6,
      }}
    >
      <View className="flex-row justify-between items-center">
        <View className="flex-1 flex flex-row"></View>

        <Text className="text-3xl font-bold font-[GillSans-SemiBold]">
          {/* Optima-ExtraBlack */}
          YouWise
        </Text>

        <View className="flex-1 flex flex-row justify-end">
          <Pressable
            className="flex-row justify-center items-center active:opacity-30 transition-opacity"
            onPress={() => router.push("/account")}
          >
            <Icons.PersonCropCircleFill size={20} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
