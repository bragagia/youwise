import { Image, Text, View } from "react-native";

export function VerticalResourcesList({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View className="border-t border-neutral-200">
      <Text className="mt-8 mb-4 mx-6 text-2xl font-medium">{title}</Text>

      {children}
    </View>
  );
}

export function VerticalResourcesListItem({
  resource,
}: {
  resource: {
    id: string;
    cover: string;
    name: string;
  };
}) {
  return (
    <View className="w-full flex flex-col mt-4">
      <View>
        <Image
          source={require("./../../assets/images/homeImage.jpg")}
          className="w-full h-48"
          alt="Resource image"
        />
      </View>

      <View className="flex flex-col justify-between gap-1 m-2">
        <Text className="text-lg flex-1" numberOfLines={2}>
          {resource.name}
        </Text>

        <Text className="text-md flex-1 text-neutral-500" numberOfLines={2}>
          1k learned
        </Text>
      </View>
    </View>
  );
}
