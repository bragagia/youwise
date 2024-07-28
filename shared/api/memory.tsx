import { CardWithResource } from "./card";

export const GOOD_REVIEW_IN_A_ROW_FOR_NEW_CARD = 2;

export type Memory = {
  id: string;

  cardId: string;

  memoryStatus: "new" | "review" | "forgotten";

  // partsMemory?: {
  //   id: string;
  //   memoryStatus: "new" | "review" | "forgotten";
  // }[]; // Used to store the memory status of each part of the card (for text cards)
};

export type MemoryWithCardAndResource = Memory & {
  card: CardWithResource;
};

export type MemoryBeingRevised = {
  memory: MemoryWithCardAndResource;
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