import {
  MemoryBeingRevised,
  MemoryBeingRevisedWithKey,
} from "@/app/revision/MemoryBeingRevised";
import { APIType } from "@/lib/api/apiProvider";
import { useCallback, useEffect, useState } from "react";
import {
  GOOD_REVIEW_IN_A_ROW_FOR_NEW_CARD,
  ResourceWithCardsAndMemory,
  RevisionStats,
} from "youwise-shared/api";
import { uuid } from "../../lib/uuid";

type DisplayedMemories = {
  prev: MemoryBeingRevisedWithKey | undefined;
  current: MemoryBeingRevisedWithKey | undefined;
  next: MemoryBeingRevisedWithKey | undefined; // Note: Next card allow to preload the next card to avoid lag when swiping
};

export function useLocalRevisionEngine(revisionDeck: MemoryBeingRevised[]) {
  const [revisionDeckCache, setRevisionDeckCache] = useState(revisionDeck);
  const [doneDeck, setDoneDeck] = useState<MemoryBeingRevised[]>([]);
  const [initialDeckSize] = useState(revisionDeckCache.length);
  const [startTime] = useState(Date.now());

  const [displayedMemories, setDisplayedMemories] =
    useState<DisplayedMemories | null>(null);

  const [finishedStats, setFinishedStats] = useState<RevisionStats | undefined>(
    undefined
  );

  const onCardSwiped = useCallback(
    (direction: "left" | "right") => {
      let newRevisionDeck = [...revisionDeckCache];
      let newDoneDeck = [...doneDeck];

      const swipedCard = newRevisionDeck.shift();
      if (!swipedCard) return; // Should never happen

      if (direction === "left") {
        ({ newRevisionDeck, newDoneDeck } = handleSwipeLeft(
          newRevisionDeck,
          newDoneDeck,
          swipedCard
        )); // Put the card back at the end of the deck
      } else {
        ({ newRevisionDeck, newDoneDeck } = handleSwipeRight(
          newRevisionDeck,
          newDoneDeck,
          swipedCard
        ));
      }

      // Current memory is always the first element of the stack. We calculate its value here in case displayedMemories.next is undefined, which happen when there is only one card left in the deck
      const newCurrentMemory = newRevisionDeck[0] && {
        ...newRevisionDeck[0],
        key: uuid(),
      };

      const newNextMemory = newRevisionDeck[1] && {
        ...newRevisionDeck[1],
        key: uuid(),
      };

      setDisplayedMemories({
        prev: displayedMemories?.current,
        current: displayedMemories?.next || newCurrentMemory,
        next: newNextMemory,
      });

      setRevisionDeckCache(newRevisionDeck);
      setDoneDeck(newDoneDeck);
    },
    [displayedMemories, initialDeckSize, revisionDeckCache, doneDeck]
  );

  function initialize() {
    const newRevisionDeck = [...revisionDeckCache];
    if (newRevisionDeck.length === 0) return;

    let currentMemory = newRevisionDeck[0];
    let nextMemory =
      newRevisionDeck.length > 1 ? newRevisionDeck[1] : undefined;

    setDisplayedMemories({
      prev: undefined,
      current: {
        ...currentMemory,
        key: uuid(),
      },
      next: nextMemory && {
        ...nextMemory,
        key: uuid(),
      },
    });

    setRevisionDeckCache(newRevisionDeck);
  }

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (revisionDeckCache.length === 0) {
      const newlyLearned = doneDeck.filter(
        (memory) => memory.memory.memoryStatus === "new"
      ).length;
      const revisedCards = doneDeck.length - newlyLearned;
      const timePerCard = (Date.now() - startTime) / doneDeck.length;

      setFinishedStats({
        newlyLearned,
        revisedCards,
        timePerCard,
      });
    }
  }, [revisionDeckCache, doneDeck]);

  const remainingCards = revisionDeckCache.reduce((acc, memory) => {
    if (memory.firstTime) {
      return (
        acc +
        (memory.firstTime.reviewCount
          ? Math.pow(
              (GOOD_REVIEW_IN_A_ROW_FOR_NEW_CARD - 1) /
                GOOD_REVIEW_IN_A_ROW_FOR_NEW_CARD,
              memory.firstTime.reviewCount
            )
          : 1)
      ); // This formula is based on reviewCount instead of goodInARow to ensure an always increasing progress
    } else if (memory.forgotten) {
      return (
        acc +
        (memory.forgotten.reviewCount
          ? Math.pow(
              (GOOD_REVIEW_IN_A_ROW_FOR_NEW_CARD - 1) /
                GOOD_REVIEW_IN_A_ROW_FOR_NEW_CARD,
              memory.forgotten.reviewCount
            )
          : 1)
      );
    } else {
      return acc + 1;
    }
  }, 0);
  const progress = (initialDeckSize - remainingCards) / initialDeckSize;

  return {
    prevMemory: displayedMemories?.prev,
    currentMemory: displayedMemories?.current,
    nextMemory: displayedMemories?.next,
    progress,
    finishedStats,
    swipeCard: onCardSwiped,
  };
}

function handleSwipeLeft(
  newRevisionDeck: MemoryBeingRevised[],
  newDoneDeck: MemoryBeingRevised[],
  swipedCard: MemoryBeingRevised
) {
  if (swipedCard.firstTime) {
    swipedCard.firstTime.failureCount++;
    swipedCard.firstTime.goodInARow = 0;
  } else if (swipedCard.forgotten) {
    swipedCard.forgotten.failureCount++;
    swipedCard.forgotten.goodInARow = 0;
  } else {
    swipedCard.forgotten = {
      goodInARow: 0,
      reviewCount: 0,
      failureCount: 1,
    };
  }

  newRevisionDeck = addToDeckWithIncrementalPosition(
    newRevisionDeck,
    swipedCard,
    0
  );

  return {
    newRevisionDeck,
    newDoneDeck,
  };
}

function handleSwipeRight(
  newRevisionDeck: MemoryBeingRevised[],
  newDoneDeck: MemoryBeingRevised[],
  swipedCard: MemoryBeingRevised
) {
  // TODO: If only one card left, get a random card already memorized and put it back in the deck

  let success: boolean;
  let goodInARow = 0;
  if (swipedCard.firstTime) {
    swipedCard.firstTime.reviewCount++;
    swipedCard.firstTime.goodInARow++;

    success =
      swipedCard.firstTime.goodInARow >= GOOD_REVIEW_IN_A_ROW_FOR_NEW_CARD;
    goodInARow = swipedCard.firstTime.goodInARow;
  } else if (swipedCard.forgotten) {
    swipedCard.forgotten.reviewCount++;
    swipedCard.forgotten.goodInARow++;

    success =
      swipedCard.forgotten.goodInARow >= GOOD_REVIEW_IN_A_ROW_FOR_NEW_CARD;
    goodInARow = swipedCard.forgotten.goodInARow;
  } else {
    success = true;
  }

  if (success) {
    newDoneDeck.push(swipedCard);
  } else {
    newRevisionDeck = addToDeckWithIncrementalPosition(
      newRevisionDeck,
      swipedCard,
      goodInARow
    );
  }

  return {
    newRevisionDeck,
    newDoneDeck,
  };
}

function addToDeckWithIncrementalPosition(
  deck: MemoryBeingRevised[],
  swipedCard: MemoryBeingRevised,
  goodInARow: number
) {
  let pos: number;

  if (goodInARow === 0) {
    pos = 3;
  }
  if (goodInARow === 1) {
    pos = 8;
  } else {
    // Not used currently with the current GOOD_REVIEW_IN_A_ROW_FOR_NEW_CARD value at 2
    pos = 20;
  }

  deck.splice(pos, 0, swipedCard);

  return deck;
}

export async function createRevisionDeckFromResource(
  api: APIType,
  resource: ResourceWithCardsAndMemory
) {
  const existingMemories: MemoryBeingRevised[] = resource.cards
    .filter((card) => card.memories.length > 0)
    .map((card) => ({
      card: card,
      memory: card.memories[0],
      resource: resource,
      memoryStatusBefore: card.memories[0].memoryStatus,
      firstTime:
        card.memories[0].memoryStatus === "new"
          ? {
              goodInARow: 0,
              reviewCount: 0,
              failureCount: 0,
            }
          : undefined,
    }));

  const newMemories: MemoryBeingRevised[] = resource.cards
    .filter((card) => card.memories.length === 0)
    .map((card) => ({
      card: card,
      memory: {
        id: uuid(),
        cardId: card.id,
        ownerUserId: api.userStored?.userId || "",
        memoryStatus: "new",
      },
      resource: resource,
      memoryStatusBefore: "new",
      firstTime: {
        goodInARow: 0,
        reviewCount: 0,
        failureCount: 0,
      },
    }));

  const revisionDeck = [...existingMemories, ...newMemories]; // TODO: Shuffle the deck

  if (newMemories.length === 0) {
    return revisionDeck;
  }

  const { error: errorNewMemories } = await api.memories.new({
    memories: newMemories.map((memory) => memory.memory),
  });
  if (errorNewMemories !== undefined) {
    throw new Error("Error while creating new memories");
  }

  return revisionDeck;
}
