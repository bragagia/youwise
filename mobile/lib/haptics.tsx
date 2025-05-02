import {
  impactAsync,
  ImpactFeedbackStyle,
  notificationAsync,
  NotificationFeedbackType,
} from "expo-haptics";
import { Platform } from "react-native";

export function useHaptics() {
  if (Platform.OS === "web") {
    return {
      notificationAsync: async (type: NotificationFeedbackType) => {
        return;
      },
      impactAsync: async (style?: ImpactFeedbackStyle) => {
        return;
      },
    };
  } else {
    return {
      notificationAsync: notificationAsync,
      impactAsync: impactAsync,
    };
  }
}
