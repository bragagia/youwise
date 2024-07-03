import React, { useRef, useState } from "react";
import { Dimensions, LayoutChangeEvent, Text, View } from "react-native";
import { AnswerButton } from "./AnswerButton";
import { CardBlock } from "./CardBlock";
import { CardChoosedContent } from "./CardChoosedContent";
import { Ressource } from "./Ressource";

export function FlashcardContentComponent({
  cardChoosedContent,
  ressource,
  onDisplayBlur,
  onCardAnswered,
}: {
  cardChoosedContent: CardChoosedContent;
  ressource: Ressource;
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

  if (!cardChoosedContent) {
    return <Text>Unsupported card type</Text>;
  }

  const [showTrueAnswer, setShowTrueAnswer] = useState(false); // Used for fake-answer cards

  function handleCardAnswered(isRight: boolean) {
    setShowTrueAnswer(true);
    onCardAnswered(isRight);
  }

  if (cardChoosedContent.type === "classic") {
    if (cardChoosedContent.subtype === "no-complication") {
      return (
        <View className="flex flex-col gap-6 self-stretch">
          <Text
            className="mx-10 font-[Avenir] font-medium text-xs"
            style={{
              color: `hsl(${ressource.tint}, 90%, 50%)`,
            }}
          >
            {ressource.resourceGroup && ressource.resourceGroup.name + " > "}

            {ressource.name}
          </Text>

          <View className="mx-10">
            <CardBlock cardBlocks={cardChoosedContent.question} />
          </View>

          <View
            className="mx-5 px-5 py-4 bg-neutral-200 rounded-2xl"
            onLayout={handleAnswerWithBlurLayout} // Attach layout handler
            ref={answerRef} // Attach ref for measurements
          >
            <CardBlock cardBlocks={cardChoosedContent.answer} />
          </View>
        </View>
      );
    } else if (cardChoosedContent.subtype === "fake-answer") {
      return (
        <View className="flex flex-col gap-6 self-stretch">
          <Text
            className="mx-10 font-[Avenir] font-medium text-xs"
            style={{
              color: `hsl(${ressource.tint}, 90%, 50%)`,
            }}
          >
            {ressource.resourceGroup && ressource.resourceGroup.name + " > "}

            {ressource.name}
          </Text>

          <View className="mx-10">
            <CardBlock cardBlocks={cardChoosedContent.question} />
          </View>

          {/* Grid of answers and fake answers: */}
          <View className="flex flex-col gap-4 mx-6">
            {cardChoosedContent.answerChoices.map((answerChoice, i) => {
              if (i % 2 !== 0) return;

              return (
                <View key={i} className="flex flex-row gap-4">
                  {cardChoosedContent.answerChoices
                    .slice(i, i + 2)
                    .map((answerChoice, e) => {
                      const isTrueAnswer =
                        cardChoosedContent.trueAnswerPos === i + e;

                      return (
                        <AnswerButton
                          key={e}
                          isGoodAnswer={isTrueAnswer}
                          showGoodAnswer={showTrueAnswer}
                          onPress={() => handleCardAnswered(isTrueAnswer)}
                        >
                          <CardBlock
                            cardBlocks={answerChoice}
                            textSize="text-md"
                          />
                        </AnswerButton>
                      );
                    })}
                </View>
              );
            })}
          </View>
        </View>
      );
    }
  } else {
    return <Text>Unsupported card type</Text>;
  }
}
