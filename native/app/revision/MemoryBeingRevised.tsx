import { Card, Memory, ResourceHeader } from "youwise-shared/api";

export type MemoryBeingRevised = {
  card: Card;
  memory: Memory;
  resource: ResourceHeader;
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
