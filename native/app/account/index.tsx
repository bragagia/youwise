import Icons from "@/components/icons";
import { useAPI } from "@/lib/api/apiProvider";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AccountPage = () => {
  const insets = useSafeAreaInsets();
  const api = useAPI();

  const handleSignOut = async () => {
    await api._internal.removeUser();

    router.back();
  };

  return (
    <View
      className="bg-white min-h-full"
      style={{
        paddingTop: 6,
        paddingLeft: Math.max(6, insets.left),
        paddingRight: Math.max(6, insets.right),
      }}
    >
      <View className="flex flex-col h-full gap-2">
        <View className="flex flex-row justify-between items-center w-full p-5">
          <Pressable
            className="active:opacity-30 transition-opacity"
            onPress={handleSignOut}
          >
            <View
              className="flex flex-row items-center justify-center gap-[0.3rem] bg-neutral-200 rounded-full px-4"
              style={{
                height: 40,
              }}
            >
              <Text className="font-[Avenir] font-bold text-black">
                Sign out
              </Text>
            </View>
          </Pressable>

          <Pressable
            className="active:opacity-30 transition-opacity"
            onPress={() => router.back()}
          >
            <Icons.Xmark width={20} height={20} color="black" />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default AccountPage;