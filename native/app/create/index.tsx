import Icons from "@/components/Icons";
import { Spinner } from "@/components/Spinner";
import { useAPI } from "@/lib/api/apiProvider";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CreatePage = () => {
  const insets = useSafeAreaInsets();
  const api = useAPI();

  const [urlInput, setUrlInput] = useState("");
  const [importLoading, setImportLoading] = useState(false);

  const handleImport = async () => {
    if (urlInput) {
      setImportLoading(true);

      await api.user.create({
        url: urlInput,
      });

      router.back();

      setImportLoading(false);
    }
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
      <View className="flex flex-col h-full gap-3">
        <View className="flex flex-row justify-between items-center w-full p-5">
          <View className="flex-1"></View>

          <View>
            <Text className="text-2xl font-semibold font-[Avenir]">
              Add content
            </Text>
          </View>

          <View className="flex-1 flex flex-row-reverse">
            <Pressable
              className="active:opacity-30 transition-opacity"
              onPress={() => router.back()}
            >
              <Icons.Xmark width={20} height={20} color="black" />
            </Pressable>
          </View>
        </View>

        {importLoading ? (
          <View className="flex flex-row justify-center items-center pt-32">
            <Spinner size={32} />
          </View>
        ) : (
          <View className="flex flex-col gap-4 px-5">
            <TextInput
              className="border border-neutral-300 p-2 rounded-lg"
              onChangeText={setUrlInput}
              value={urlInput}
              placeholder="From an article / youtube URL"
            />

            <View className="flex flex-row justify-center">
              <Pressable
                className="bg-neutral-300 text-white py-3 px-5 rounded-full"
                onPress={handleImport}
              >
                <Text className="font-[Avenir] text-center font-semibold">
                  Import
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default CreatePage;
