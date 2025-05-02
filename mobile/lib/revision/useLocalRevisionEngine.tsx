import { shuffleArray } from "@/lib/arrays";
import { IsMemoryParamsLearned, ScheduleMemoryParams } from "@/lib/fsrsWrapper";
import {
  RevisingMemoryWithKey,
  RevisingMemory,
} from "@/lib/revision/memoryBeingRevised";
import { CardWithMemoryAndResourceHeader } from "@/lib/types/dailyRevisions";
import { ResourceWithCardsAndMemory } from "@/lib/types/ressource";
import { RevisionStats } from "@/lib/types/revisionStats";
import { uuid } from "@/lib/uuid";
import { useCallback, useEffect, useState } from "react";

type DisplayedMemories = {
  prev: RevisingMemoryWithKey | undefined;
  current: RevisingMemoryWithKey | undefined;
  next: RevisingMemoryWithKey | undefined; // Note: Next card allow to preload the next card to avoid lag when swiping
};

export function useLocalRevisionEngine(revisionDeck: RevisingMemory[]) {
  const [revisionDeckCache, setRevisionDeckCache] = useState(revisionDeck);
  const [doneDeck, setDoneDeck] = useState<RevisingMemory[]>([]);
  const [initialDeckSize] = useState(revisionDeckCache.length);
  const [startTime] = useState(Date.now());

  const [displayedMemories, setDisplayedMemories] =
    useState<DisplayedMemories | null>(null);

  const [finishedStats, setFinishedStats] = useState<RevisionStats | undefined>(
    undefined
  );

  const onCardSwiped = useCallback(
    async (direction: "left" | "right") => {
      let newRevisionDeck = [...revisionDeckCache];
      let newDoneDeck = [...doneDeck];

      const swipedCard = newRevisionDeck.shift();
      if (!swipedCard) return; // Should never happen

      let updatedCard: RevisingMemory;
      if (direction === "left") {
        ({ newRevisionDeck, newDoneDeck, updatedCard } = handleSwipeLeft(
          newRevisionDeck,
          newDoneDeck,
          swipedCard
        )); // Put the card back at the end of the deck
      } else {
        ({ newRevisionDeck, newDoneDeck, updatedCard } = handleSwipeRight(
          newRevisionDeck,
          newDoneDeck,
          swipedCard
        ));
      }

      // const ret = await api.memories.update({
      //   memories: [
      //     { ...updatedCard.memory, memoryParams: updatedCard.memoryParams }, // Note: We need to use the memoryParams of the revising object because it's the one that has been updated, and not the one in the memory object
      //   ],
      // });
      // if (ret.error) {
      //   console.log("Error while updating memory", ret.error);
      //   throw new Error("Error while updating memory");
      // }

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
        (revisingCard) => revisingCard.memory.memoryParams === undefined // The memoryParams inside the memory object stay at the state of the when the revision started so we can use it to know if the card was newly learned
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
    if (IsMemoryParamsLearned(memory.memoryParams)) {
      return acc + 1;
    }

    return acc + (memory.reviewCount ? Math.pow(0.5, memory.reviewCount) : 1); // This formula is based on reviewCount instead of goodInARow to ensure an always increasing progress
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
  newRevisionDeck: RevisingMemory[],
  newDoneDeck: RevisingMemory[],
  swipedCard: RevisingMemory
) {
  swipedCard.reviewCount++;
  swipedCard.goodReviewInARow = 0;

  swipedCard.memoryParams = ScheduleMemoryParams(
    swipedCard.memoryParams,
    "Fail"
  );

  newRevisionDeck = addToDeckWithIncrementalPosition(
    newRevisionDeck,
    swipedCard,
    0
  );

  return {
    newRevisionDeck,
    newDoneDeck,
    updatedCard: swipedCard,
  };
}

function handleSwipeRight(
  newRevisionDeck: RevisingMemory[],
  newDoneDeck: RevisingMemory[],
  swipedCard: RevisingMemory
) {
  // TODO: If only one card left, get a random card already memorized and put it back in the deck

  swipedCard.reviewCount++;
  swipedCard.goodReviewInARow++;

  swipedCard.memoryParams = ScheduleMemoryParams(
    swipedCard.memoryParams,
    "Good"
  );

  if (IsMemoryParamsLearned(swipedCard.memoryParams)) {
    newDoneDeck.push(swipedCard);
  } else {
    newRevisionDeck = addToDeckWithIncrementalPosition(
      newRevisionDeck,
      swipedCard,
      swipedCard.goodReviewInARow
    );
  }

  return {
    newRevisionDeck,
    newDoneDeck,
    updatedCard: swipedCard,
  };
}

function addToDeckWithIncrementalPosition(
  deck: RevisingMemory[],
  swipedCard: RevisingMemory,
  goodInARow: number
) {
  let pos: number;

  if (goodInARow == 0) {
    pos = 2 + Math.floor(Math.random() * 3);
  } else {
    // if (goodInARow == 1)
    pos = 4 + Math.floor(Math.random() * 4);
  }

  deck.splice(pos, 0, swipedCard);

  return deck;
}

export async function createRevisionDeckFromResource(
  //api: APIType,
  resource: ResourceWithCardsAndMemory
) {
  return await createRevisionDeckFromCards(
    //api,
    resource.cards
      .filter(
        (card) =>
          !card.memory || !IsMemoryParamsLearned(card.memory.memoryParams)
      )
      .map((card) => ({ ...card, resourceHeader: resource }))
  );
}

export async function createRevisionDeckFromCards(
  //api: APIType,
  cards: CardWithMemoryAndResourceHeader[]
) {
  const existingRevisingMemories: RevisingMemory[] = cards
    .filter((card) => card.memory !== null)
    .map((card) => ({
      resource: card.resourceHeader,
      card: card,
      memory: card.memory!,
      memoryParams: card.memory!.memoryParams,
      goodReviewInARow: 0,
      reviewCount: 0,
    }));

  const newRevisingMemories: RevisingMemory[] = cards
    .filter((card) => card.memory === null)
    .map((card) => ({
      resource: card.resourceHeader,
      card: card,
      memory: {
        id: uuid(),
        cardId: card.id,
        ownerUserId: "", // api.userStored?.userId || ""
        memoryParams: null,
      },
      memoryParams: null,
      goodReviewInARow: 0,
      reviewCount: 0,
    }));

  const revisionDeck = shuffleArray([
    ...existingRevisingMemories,
    ...newRevisingMemories,
  ]);

  if (newRevisingMemories.length === 0) {
    return { revisionDeck };
  }

  // const { error: errorNewMemories } = await api.memories.new({
  //   memories: newRevisingMemories.map((memory) => memory.memory),
  // });
  // if (errorNewMemories !== undefined) {
  //   return { error: new Error("Error while creating new memories") };
  // }

  return { revisionDeck };
}
