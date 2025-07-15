import { getImageUrl } from "@/lib/images";
import { Link } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, View } from "react-native";

export function HorizontalResourcesList({
  title,
  hrefToMore,
  children,
}: {
  title: string;
  hrefToMore?: string;
  children: React.ReactNode;
}) {
  return (
    <View key={title} className="pt-3 border-b border-neutral-200">
      <View className="flex-row justify-between px-6">
        <Text className="text-lg font-medium">{title}</Text>

        {hrefToMore && <Text className="text-sm">View all</Text>}
      </View>

      <ScrollView horizontal className="">
        <View className="flex flex-row pt-2 px-4 gap-3 mb-3">{children}</View>
      </ScrollView>
    </View>
  );
}

export function HorizontalResourcesListItem({
  resource,
}: {
  resource: {
    id: string;
    cover: string;
    name: string;
  };
}) {
  return (
    <Link href={"/"}>
      <View className="w-40 flex flex-col">
        <View
          className="rounded-lg bg-white"
          style={{
            shadowColor: "#000",
            shadowOffset: {
              width: 2,
              height: 4,
            },
            shadowOpacity: 0.3,
            shadowRadius: 5,
            elevation: 5, // Android only
          }}
        >
          <Image
            source={getImageUrl(resource.cover)}
            className="rounded-lg"
            style={{
              height: 112,
              width: "100%",
            }}
            alt="Resource image"
          />
        </View>

        <View className="flex flex-row justify-between gap-1 mt-2 px-1">
          <Text className="text-sm flex-1" numberOfLines={2}>
            {resource.name}
          </Text>

          <View className="pt-[2px]">
            {/* <CircularProgressView progress={0.5} /> */}
          </View>
        </View>
      </View>
    </Link>
  );
}
