export const GOOD_REVIEW_IN_A_ROW_FOR_NEW_CARD = 2;

export type CardImageBlock = {
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

export type CardBlockPrimitive = string | CardImageBlock;
export type CardBlocks = CardBlockPrimitive[];

export type ClassicCardOcclusionText = {
  type: "text";
  value: string;
};

// ClassicCardOcclusionBlock are used to hide a whole block
export type ClassicCardOcclusionBlock = {
  type: "block";
  blockId: string;
  blockImageSection?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
};

export type ClassicCardVariantOcclusionsComplication = {
  type: "occlusions";
  answer: CardBlocks;
  occlusions: (ClassicCardOcclusionText | ClassicCardOcclusionBlock)[]; // Answer will be hidden behind occlusions
};

export type ClassicCardVariantFakeAnswerComplication = {
  type: "fake-answer";
  question: CardBlocks;
  answer: CardBlocks;
  fakeAnswers: CardBlocks[]; // Answer will be presented sometimes as a quizz, sometimes as a hidden answer (always will be presented as quizz on first presentation)
};

export type ClassicCardVariantWithoutComplication = {
  type: "no-complication";
  question: CardBlocks;
  answer: CardBlocks;
};

export type ClassCardVariant =
  | ClassicCardVariantOcclusionsComplication
  | ClassicCardVariantFakeAnswerComplication
  | ClassicCardVariantWithoutComplication;

// ClassicCardValue are used to memorize standalone facts
export type ClassicCardValue = {
  type: "classic";
  variants: ClassCardVariant[];
};

export type TextCardLine = {
  id: string; // Unique ID to identify the part
  part: CardBlocks; // Must be smart cut by AI to be at least multiple words but not more than 6 (to be less than 7 items of short memory limit)
}[];

// TextCardValue are used to memorize long texts or quote by heart
export type TextCardValue = {
  type: "text";
  title: CardBlocks;
  text: TextCardLine[];
};

export type CardValue = ClassicCardValue | TextCardValue;

export type Card = {
  resource: Ressource;
  value: CardValue;
};

export type Memory = {
  id: string;

  card: Card;

  memoryStatus: "new" | "review" | "forgotten";

  partsMemory?: {
    id: string;
    memoryStatus: "new" | "review" | "forgotten";
  }[]; // Used to store the memory status of each part of the card (for text cards)
};

export type MemoryBeingRevised = {
  memory: Memory;
  memoryStatusBefore: Memory["memoryStatus"];
  firstTime?: {
    goodInARow: number;
    reviewCount: number;
    failureCount: number;
  };
  forgotten?: {
    goodInARow: number;
    reviewCount: number;
    failureCount: number;
  };
};

export type MemoryBeingRevisedWithKey = MemoryBeingRevised & {
  key: string; // That unique random key allow to force the component to render correctly, it identify the pass of the memory, not the memory itself
};

// TODO: separate file:

export type Ressource = {
  name: string;
  resourceGroup?: {
    name: string;
  };
};
