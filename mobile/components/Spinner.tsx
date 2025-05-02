import Icons from "@/components/Icons";
import { View } from "react-native";

export function Spinner({
  size,
  color = "black",
}: {
  size: number;
  color?: string;
}) {
  return (
    <View className="flex flex-row items-center justify-center">
      <View className="animate-spin">
        <Icons.Spinner size={size} color={color} />
      </View>
    </View>
  );
}
