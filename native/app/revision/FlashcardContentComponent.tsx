import React, { useRef } from "react";
import { Dimensions, LayoutChangeEvent, Text, View } from "react-native";
import { Memory } from "./Memory";

export function FlashcardContentComponent({
  memory,
  onAnswerPositionLayout,
}: {
  memory: Memory;
  onAnswerPositionLayout: (height: number) => void;
}) {
  const webViewRef = useRef<View>(null); // Ref to attach to the WebView container for measurements

  const handleWebViewLayout = (event: LayoutChangeEvent) => {
    if (!webViewRef.current) return;

    const layout = event.nativeEvent.layout;
    webViewRef.current.measure((x, y, width, height, pageX, pageY) => {
      // Calculate blur height based on the WebView's position
      // Assuming 'pageY' gives us the top position of the WebView relative to the screen
      const screenHeight = Dimensions.get("window").height; // Get the screen height
      const topPosition = pageY; // Top position of the WebView
      const calculatedBlurHeight = screenHeight - topPosition; // Height from WebView top to bottom of the screen
      onAnswerPositionLayout(calculatedBlurHeight + 5);
    });
  };

  return (
    <View className="flex flex-col gap-6 self-stretch">
      <Text className="mx-10 font-[Avenir] font-medium text-xs text-orange-600">
        {memory.question.resource.resourceGroup &&
          memory.question.resource.resourceGroup.name + " > "}

        {memory.question.resource.name}
      </Text>

      <Text className="mx-10 font-[Avenir] font-medium text-lg text-gray-800">
        {memory.question.question}
      </Text>

      <View
        className="mx-6 px-4 py-3 border-2 border-black rounded-xl"
        onLayout={handleWebViewLayout} // Attach layout handler
        ref={webViewRef} // Attach ref for measurements
      >
        <Text className="font-[Avenir] font-bold text-lg text-black">
          {memory.question.answer}
        </Text>
      </View>

      {/* ### Future webview implementation ###
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
            </View> */}
    </View>
  );
}
