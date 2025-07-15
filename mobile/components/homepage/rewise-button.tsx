import Icons from "@/components/Icons";
import { LinearGradient } from "expo-linear-gradient";
import { Href, Link } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function getRewiseButtonBottomInset(
  insets: ReturnType<typeof useSafeAreaInsets>
) {
  return Math.max(insets.bottom, 8) + 64;
}

export function RewiseButton({ href }: { href: Href }) {
  const insets = useSafeAreaInsets();

  const revisionButtonMarginBottom = Math.max(insets.bottom, 8);

  return (
    <View className="absolute bottom-0 w-full z-10 border-white flex flex-col">
      <LinearGradient
        colors={[
          "rgba(255,255,255,0)",
          "rgba(255,255,255,1)",
          "rgba(255,255,255,1)",
        ]}
        style={{
          paddingRight: insets.right + 12,
          paddingLeft: insets.left + 12,
          paddingBottom: revisionButtonMarginBottom,
        }}
      >
        <Link asChild href={href}>
          <TouchableOpacity className="rounded-full overflow-hidden">
            <LinearGradient
              colors={[
                // "rgb(229, 48, 24)",
                // "rgb(229, 48, 24)",
                "rgb(255, 149, 0)", // Orange
                "rgb(255, 204, 0)", // Yellow
                "rgb(255, 204, 0)", // Yellow
                "rgb(255, 204, 0)", // Yellow
                "rgb(52, 199, 89)", // Green
                "rgb(0, 122, 255)", // Blue
                "rgb(88, 86, 214)", // Indigo
                "rgb(191, 90, 242)", // Violet
                "rgb(225, 59, 48)", // Red
              ]}
              start={{ x: 0.5, y: 3 }}
              end={{ x: 0.8, y: 0 }}
              className="rounded-full"
            >
              <View className="bg-white rounded-full m-[2px]">
                <View className="flex-row items-center justify-between py-3 px-6">
                  <View className="flex-row items-center gap-1">
                    <Icons.LineWeight size={16} color={"black"} />
                    <Text className="font-bold text-sm">4</Text>
                  </View>

                  <View className="flex-row items-center gap-2">
                    <Text className="text-lg font-bold font-[Avenir]">
                      Start daily{" "}
                      <Text className="font-[GillSans]">ReWise</Text>
                    </Text>

                    <Icons.PlayFill size={14} color={"black"} />
                  </View>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Link>
      </LinearGradient>
    </View>
  );
}
