"use client";

import { UnifiedCardList } from "@/components/cards/unified-card-list";
import { GenerateCardsButton } from "@/components/GenerateCardsButton";
import { CardModel, CardModelUnsaved } from "@youwise/shared";
import { useState } from "react";
import {
  createCardAction,
  deleteCardAction,
  updateCardAction,
} from "./actions";

interface SectionCardsClientProps {
  initialCards: CardModel[];
  sectionId: string;
  resourceId: string;
}

export function SectionCardsClient({
  initialCards,
  sectionId,
  resourceId,
}: SectionCardsClientProps) {
  const [cards, setCards] = useState<CardModel[]>(initialCards);

  const handleCreateCard = async (card: CardModelUnsaved) => {
    const result = await createCardAction(sectionId, card);

    if (!result.success) {
      alert(result.error || "Failed to create card");

      throw new Error("Card creation failed");
    }

    setCards((prev) => [...prev, result.card]);
  };

  const handleUpdateCard = async (cardId: string, card: CardModelUnsaved) => {
    const result = await updateCardAction(cardId, card);

    if (!result.success) {
      alert(result.error || "Failed to update card");
      return;
    }

    // Update the card in the list
    setCards((prev) => prev.map((c) => (c.id === cardId ? result.card : c)));
  };

  const handleDeleteCard = async (cardId: string) => {
    const result = await deleteCardAction(cardId);

    if (!result.success) {
      alert("Failed to delete card");
      return;
    }

    // Remove the card from the list
    setCards((prev) => prev.filter((c) => c.id !== cardId));
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h2>Cards ({cards.length})</h2>
        <GenerateCardsButton sectionId={sectionId} resourceId={resourceId} />
      </div>

      <UnifiedCardList
        cards={cards}
        onCreateCard={handleCreateCard}
        onUpdateCard={handleUpdateCard}
        onDeleteCard={handleDeleteCard}
      />
    </>
  );
}
