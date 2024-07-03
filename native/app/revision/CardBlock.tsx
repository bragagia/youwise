import React from "react";
import { Text, View } from "react-native";
import { CardBlocks } from "./Card";

export function CardBlock({
  cardBlocks,
  textSize = "text-lg",
}: {
  cardBlocks: CardBlocks;
  textSize?: "text-md" | "text-lg";
}) {
  return (
    <View className="flex flex-col gap-2">
      {cardBlocks.map((block, i) => {
        if (typeof block === "string") {
          return (
            <Text
              key={i}
              className={`font-[Avenir] font-medium text-neutral-800 ${textSize}`}
            >
              {block}
            </Text>
          );
        } else {
          return (
            <Text
              key={i}
              className={`font-[Avenir] font-medium text-neutral-800 ${textSize}`}
            >
              Unsupported block type
            </Text>
          );
        }
      })}
    </View>
  );

  /* ### Future webview implementation ###
  <View className="mx-6 border-2 rounded-xl h-72 shrink-0">
    <WebView
      scrollEnabled={false}
      originWhitelist={["*"]}
      source={{
        //html: "<body><h1><center>Hello world</center></h1></body>",
        uri: "https://miniature.earth/demo/world-trip.htm",
      }}
      style={{
        height: "100%",
        width: "100%",
        flex: 1,
        borderRadius: 8,
        backgroundColor: "transparent",
      }}
    />
    <View className="absolute right-0 bottom-0 top-0 left-0 opacity-0 rounded-lg" />
    {/* This disable touch events on webview * /}
  </View> */
}
