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

// export type MemoryWithCardAndResource = Memory & {
//   card: CardWithResource;
// };
