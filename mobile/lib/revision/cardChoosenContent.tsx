import { CardBlocks } from "@/lib/types/card";

export type CardChoosenContent =
  | {
      type: "classic";
      subtype: "no-complication";
      question: CardBlocks;
      answer: CardBlocks;
    }
  | {
      type: "classic";
      subtype: "fake-answer";
      question: CardBlocks;
      answerChoices: CardBlocks[];
      trueAnswerPos: number;
    }
  | {
      type: "classic";
      subtype: "occlusions";
    }
  | {
      type: "text";
    };
