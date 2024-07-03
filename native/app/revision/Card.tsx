import { Ressource } from "./Ressource";

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
