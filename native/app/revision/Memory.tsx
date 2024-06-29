import { uuid } from "@/lib/uuid";

type CardImageBlock = {
  type: "image";
  blockId: string;
  imageId: string;
  occludeParts?: {
    x: number;
    y: number;
    width: number;
    height: number;
  }[]; // Those parts will always be occluded, even when the answer is shown. This is useful for hiding other cards answers in the image
};
type CardBlockPrimitive = string | CardImageBlock;
type CardBlock = CardBlockPrimitive[];
type ClassicCardOcclusionText = {
  type: "text";
  value: string;
};
// ClassicCardOcclusionBlock are used to hide a whole block
type ClassicCardOcclusionBlock = {
  type: "block";
  blockId: string;
  blockImageSection?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
};
type ClassicCardOcclusionsComplication = {
  occlusions: (ClassicCardOcclusionText | ClassicCardOcclusionBlock)[]; // Answer will be hidden behind occlusions
};
type ClassicCardFakeAnswerComplication = {
  fakeAnswers: CardBlock[]; // Answer will be presented sometimes as a quizz, sometimes as a hidden answer (always will be presented as quizz on first presentation)
};
// ClassicCardValue are used to memorize standalone facts
type ClassicCardValue = {
  type: "classic";
  variants: {
    question?: CardBlock; // There can be no question if the card use occlusions in the answer
    answer: CardBlock;
    answerComplication?:
      | ClassicCardOcclusionsComplication
      | ClassicCardFakeAnswerComplication;
  }[];
};
type TextCardLine = {
  id: string; // Unique ID to identify the part
  part: CardBlock; // Must be smart cut by AI to be at least multiple words but not more than 6 (to be less than 7 items of short memory limit)
}[];
// TextCardValue are used to memorize long texts or quote by heart
type TextCardValue = {
  type: "text";
  title: CardBlock;
  text: TextCardLine[];
};
type CardValue = ClassicCardValue | TextCardValue;

export type Memory = {
  id: string;
  card: {
    resource: {
      name: string;
      resourceGroup?: {
        name: string;
      };
    };
    value: CardValue;
  };
  memoryStatus: "new" | "review" | "forgotten";
  partsMemory?: {
    id: string;
    memoryStatus: "new" | "review" | "forgotten";
  }[]; // Used to store the memory status of each part of the card (for text cards)
};
export const memories: Memory[] = [
  {
    id: uuid(),
    card: {
      resource: {
        name: "SF",
        resourceGroup: {
          name: "Culture geek",
        },
      },

      value: {
        type: "classic",
        variants: [
          {
            question: [
              "What is the answer to life, the universe, and everything?",
            ],
            answer: ["42"],
          },
        ],
      },
    },

    memoryStatus: "new",
  },
  {
    id: uuid(),
    card: {
      resource: {
        name: "SF",
        resourceGroup: {
          name: "Culture geek",
        },
      },

      value: {
        type: "classic",
        variants: [
          {
            question: ["What is AlphaGo?"],
            answer: ["A computer program that plays the board game Go."],
          },
        ],
      },
    },

    memoryStatus: "new",
  },
];
