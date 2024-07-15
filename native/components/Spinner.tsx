import Icons from "@/components/icons";
import { View } from "react-native";

export function Spinner({
  size,
  color = "black",
}: {
  size: number;
  color?: string;
}) {
  return (
    <View className="animate-spin">
      <Icons.Spinner width={size} height={size} color={color} />
    </View>
  );
}
