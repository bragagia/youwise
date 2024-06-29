import { useState } from "react";
import { uuid } from "../../lib/uuid";
import { Memory, memories } from "./Memory";

export function useLocalRevisionEngine() {
  const [displayedMemories, setDisplayedMemories] = useState<Memory[]>([
    memories[0],
    memories[1],
  ]);
  const prevMemory =
    displayedMemories.length === 3 ? displayedMemories[0] : null;
  const currentMemory = displayedMemories[displayedMemories.length - 2];
  const nextMemory = displayedMemories[displayedMemories.length - 1];

  const onCardSwiped = (direction: "left" | "right") => {
    setDisplayedMemories([
      currentMemory, // New prev
      nextMemory, // New current
      { ...currentMemory, id: uuid() }, // New next
    ]);
  };

  return {
    prevMemory,
    currentMemory,
    nextMemory,
    swipeCard: onCardSwiped,
  };
}
