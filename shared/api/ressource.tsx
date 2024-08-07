import { CardWithMemory } from "./card";

export type ResourceBlock =
  | {
      type: "paragraph";
      content: string;
    }
  | {
      type: "youtube";
      youtubeId: string;
    }
  | {
      type: "title";
      level: 1 | 2 | 3;
      content: string;
    }
  | {
      type: "image";
      source: string;
    };

export const ResourceObj = {
  id: "string",
  name: "string",
  tint: 0,
  originalUrl: "string",
  content: "string",
};

export type ResourceHeader = {
  id: string;
  name: string;
  tint: number;
};

export type Resource = ResourceHeader & {
  originalUrl: string | null;
  content: string;
};

export type ResourceWithCardsAndMemory = Resource & {
  cards: CardWithMemory[];
};

export type ResourceGetRequest = {
  id: string;
};

export type ResourceGetResponse = ResourceWithCardsAndMemory;

export type ResourcesCreateRequest = {
  url: string;
};

export type ResourcesCreateResponse = {};
