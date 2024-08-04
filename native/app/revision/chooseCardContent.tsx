import { RevisingMemory } from "@/app/revision/MemoryBeingRevised";
import {
  IsMemoryParamsFirstReview,
  WasMemoryParamsForgotten,
} from "@/lib/fsrsWrapper";
import { CardVariant } from "youwise-shared/api";
import { CardChoosenContent } from "./CardChoosenContent";

export function chooseCardContent(
  revisingMemory: RevisingMemory
): CardChoosenContent {
  const variants = revisingMemory.card.variants;

  const isFirstReview = IsMemoryParamsFirstReview(revisingMemory.memoryParams);
  const wasForgotten = WasMemoryParamsForgotten(revisingMemory.memoryParams);

  let randomVariantChoice: CardVariant;
  if (isFirstReview) {
    randomVariantChoice = variants[0];

    // We always use first variant for new cards
  } else {
    randomVariantChoice = variants[Math.floor(Math.random() * variants.length)];
  }

  if (randomVariantChoice.type === "classic") {
    let shouldUseQuiz = false; // Use quiz only for first review of forgotten and new cards, never for their last review. Use quiz random for known cards

    if (!randomVariantChoice.fakeAnswers) {
      shouldUseQuiz = false;
    } else if (
      (isFirstReview || wasForgotten) &&
      revisingMemory.goodReviewInARow === 0
    ) {
      shouldUseQuiz = true;
    } else if (isFirstReview || wasForgotten) {
      // We never use quiz for the last review of new and forgotten cards (to make sure the user knows the answer)
      shouldUseQuiz = false;
    } else {
      shouldUseQuiz = Math.random() < 0.1;
    }

    if (shouldUseQuiz && randomVariantChoice.fakeAnswers) {
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

      // Randomize the position of the real answer
      const trueAnswerPos = Math.floor(Math.random() * 4);

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
  }

  // Else
  return {
    type: "text",
  };
}
