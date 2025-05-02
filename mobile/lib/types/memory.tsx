export type Memory = {
  id: string;

  cardId: string;

  ownerUserId: string;

  memoryParams: MemoryParams;

  // partsMemory?: {
  //   id: string;
  //   memoryStatus: "new" | "review" | "forgotten";
  // }[]; // Used to store the memory status of each part of the card (for text cards)
};

export type MemoryParamsState = "Learning" | "Review" | "Relearning";

export type MemoryParams = null | {
  /**
   * @format date-time
   */
  dueEasy: string;
  /**
   * @format date-time
   */
  dueNormal: string;
  /**
   * @format date-time
   */
  dueHard: string;
  /**
   * @format date-time
   */
  dueHarder: string;
  fsrs_state: MemoryParamsState; // The current state of the card (Learning, Review, Relearning). Note: FSRS New state is represented by the memory params being undefined
  fsrs_stability: number; // A measure of how well the information is retained
  fsrs_difficulty: number; // Reflects the inherent difficulty of the card content
  fsrs_elapsed_days: number; // Days since the card was last reviewed
  fsrs_scheduled_days: number; // The interval at which the card is next scheduled
  fsrs_reps: number; // Total number of times the card has been reviewed
  fsrs_lapses: number; // Times the card was forgotten or remembered incorrectly
  /**
   * @format date-time
   */
  fsrs_last_review: string | null; // The most recent review date, if applicable
};

export type MemoryInsert = Memory;
export type MemoryUpdate = Pick<Memory, "id"> & Partial<Memory>;

export type MemoriesNewRequest = {
  memories: MemoryInsert[];
};

export type MemoriesNewResponse = {
  memories: Memory[];
};

export type MemoriesUpdateRequest = {
  memories: MemoryUpdate[];
};

export type MemoriesUpdateResponse = {};
