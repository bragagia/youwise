import { CardWithMemory } from "./card";
import { ResourceHeader } from "./ressource";

export type CardWithMemoryAndResourceHeader = CardWithMemory & {
  resourceHeader: ResourceHeader;
};

export type DailyRevisions = {
  /**
   * @format date
   */
  date: string;

  cards: CardWithMemoryAndResourceHeader[];
};

export type DailyRevisionsGenerateRequest = {
  /**
   * @format date
   */
  date: string;
};

export type DailyRevisionsGenerateResponse = DailyRevisions;
