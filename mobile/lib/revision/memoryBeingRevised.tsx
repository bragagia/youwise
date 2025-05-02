import { Card } from "@/lib/types/card";
import { Memory, MemoryParams } from "@/lib/types/memory";
import { ResourceHeader } from "@/lib/types/ressource";

export type RevisingMemory = {
  card: Card;
  memory: Memory;
  resource: ResourceHeader;
  reviewCount: number;
  goodReviewInARow: number;
  memoryParams: MemoryParams;
};

export type RevisingMemoryWithKey = RevisingMemory & {
  key: string; // That unique random key allow to force the component to render correctly, it identify the pass of the memory, not the memory itself
};
