import { ResourceHeader } from "@/lib/types/ressource";
import React, { useRef, useState } from "react";
import { Dimensions, LayoutChangeEvent, Text, View } from "react-native";
import { CardChoosenContent } from "../../lib/revision/cardChoosenContent";
import { AnswerButtonComponent } from "./AnswerButtonComponent";
import { CardBlockComponent } from "./CardBlockComponent";

export function FlashcardContentComponent({
  cardChoosedContent,
  ressource,
  onDisplayBlur,
  onCardAnswered,
}: {
  cardChoosedContent: CardChoosenContent;
  ressource: ResourceHeader;
  onDisplayBlur: (height: number) => void; // Used on swipable cards
  onCardAnswered: (isRight: boolean) => void; // Used on non-swipable cards
}) {
  const answerRef = useRef<View>(null);

  const handleAnswerWithBlurLayout = (event: LayoutChangeEvent) => {
    if (!answerRef.current) return;

    answerRef.current.measure((x, y, width, height, pageX, pageY) => {
      // Assuming 'pageY' gives us the top position of the Answer relative to the screen
      const screenHeight = Dimensions.get("window").height; // Get the screen height
      const topPosition = pageY;
      const calculatedBlurHeight = screenHeight - topPosition; // Height from answer top to bottom of the screen
      onDisplayBlur(calculatedBlurHeight + 5);
    });
  };

  const [showTrueAnswer, setShowTrueAnswer] = useState(false); // Used for fake-answer cards

  function handleCardAnswered(isRight: boolean) {
    setShowTrueAnswer(true);
    onCardAnswered(isRight);
  }

  if (!cardChoosedContent) {
    return <Text>Unsupported card type</Text>;
  }

  if (cardChoosedContent.type === "text") {
    return <Text>Unsupported card type</Text>;
  }

  if (cardChoosedContent.subtype === "occlusions") {
    return (
      <View>
        <Text>Unsupported card subtype</Text>
      </View>
    );
  }

  return (
    <View className="flex flex-col gap-6 self-stretch">
      <Text
        className="mx-10 font-[Avenir] font-medium text-sm"
        style={{
          color: `hsl(${ressource.tint}, 90%, 50%)`,
        }}
      >
        {/* {ressource.resourceGroup && ressource.resourceGroup.name + " > "} */}

        {ressource.name}
      </Text>

      <View className="mx-10">
        <CardBlockComponent cardBlocks={cardChoosedContent.question} />
      </View>

      {cardChoosedContent.subtype === "no-complication" && (
        <View
          className="mx-5 px-5 py-4 bg-neutral-200 rounded-2xl"
          onLayout={handleAnswerWithBlurLayout} // Attach layout handler
          ref={answerRef} // Attach ref for measurements
        >
          <CardBlockComponent cardBlocks={cardChoosedContent.answer} />
        </View>
      )}

      {/* Grid of answers and fake answers: */}
      {cardChoosedContent.subtype === "fake-answer" && (
        <View className="flex flex-col gap-4 mx-6">
          {cardChoosedContent.answerChoices.map((_, i) => {
            if (i % 2 !== 0) return;

            return (
              <View key={i} className="flex flex-row gap-4">
                {cardChoosedContent.answerChoices
                  .slice(i, i + 2)
                  .map((answerChoice, e) => {
                    const isTrueAnswer =
                      cardChoosedContent.trueAnswerPos === i + e;

                    return (
                      <AnswerButtonComponent
                        key={e}
                        isGoodAnswer={isTrueAnswer}
                        showGoodAnswer={showTrueAnswer}
                        onPress={() => handleCardAnswered(isTrueAnswer)}
                      >
                        <CardBlockComponent
                          cardBlocks={answerChoice}
                          textSize="text-md"
                        />
                      </AnswerButtonComponent>
                    );
                  })}
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}
