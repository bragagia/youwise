import { ClassCardVariant } from "./Card";
import { CardChoosedContent } from "./CardChoosedContent";
import {
  GOOD_REVIEW_IN_A_ROW_FOR_NEW_CARD,
  MemoryBeingRevised,
} from "./Memory";

export function chooseCardContent(
  memoryBeingRevised: MemoryBeingRevised
): CardChoosedContent {
  const value = memoryBeingRevised.memory.card.value;

  if (value.type === "classic") {
    let randomVariantChoice: ClassCardVariant;
    if (memoryBeingRevised.firstTime) {
      randomVariantChoice = value.variants[0]; // We always use first variant for new cards
    } else {
      randomVariantChoice =
        value.variants[Math.floor(Math.random() * value.variants.length)];
    }

    if (randomVariantChoice.type === "no-complication") {
      return {
        type: "classic",
        subtype: "no-complication",
        question: randomVariantChoice.question,
        answer: randomVariantChoice.answer,
      };
    } else if (randomVariantChoice.type === "fake-answer") {
      let shouldUseQuizz = false;
      if (
        memoryBeingRevised.firstTime &&
        memoryBeingRevised.firstTime.goodInARow <
          GOOD_REVIEW_IN_A_ROW_FOR_NEW_CARD - 1
      ) {
        shouldUseQuizz = true;
      } else if (
        memoryBeingRevised.forgotten &&
        memoryBeingRevised.forgotten.goodInARow <
          GOOD_REVIEW_IN_A_ROW_FOR_NEW_CARD - 1
      ) {
        shouldUseQuizz = true;
      } else if (memoryBeingRevised.firstTime || memoryBeingRevised.forgotten) {
        shouldUseQuizz = false; // We never use quizz for the last review of new and forgotten cards (to make sure the user knows the answer)
      } else {
        shouldUseQuizz = Math.random() < 0.1;
      }

      if (shouldUseQuizz) {
        const fakeAnswersCopy = [...randomVariantChoice.fakeAnswers];

        // Get 3 random fake answer from array copy
        let answerChoices = [
          fakeAnswersCopy.splice(
            Math.floor(Math.random() * fakeAnswersCopy.length),
            1
          )[0],
          fakeAnswersCopy.splice(
            Math.floor(Math.random() * fakeAnswersCopy.length),
            1
          )[0],
          fakeAnswersCopy.splice(
            Math.floor(Math.random() * fakeAnswersCopy.length),
            1
          )[0],
        ];

        const trueAnswerPos = Math.floor(Math.random() * 4); // Randomize the position of the real answer

        // Insert the real answer at the random position
        answerChoices.splice(trueAnswerPos, 0, randomVariantChoice.answer);

        return {
          type: "classic",
          subtype: "fake-answer",
          question: randomVariantChoice.question,
          answerChoices,
          trueAnswerPos,
        };
      } else {
        return {
          type: "classic",
          subtype: "no-complication",
          question: randomVariantChoice.question,
          answer: randomVariantChoice.answer,
        };
      }
    } else if (randomVariantChoice.type === "occlusions") {
      return {
        type: "classic",
        subtype: "occlusions",
      };
    }
  }
  // Else
  return {
    type: "text",
  };
}
