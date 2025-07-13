"use client";

import { Button } from "@/components/ui/button";
import { CardModel, CardModelUnsaved } from "@youwise/shared";
import { Plus } from "lucide-react";
import { useState } from "react";
import { UnifiedCard } from "./unified-card";

interface UnifiedCardListProps {
  cards: CardModel[] | CardModelUnsaved[];
  mode?: "display" | "edit";
  onCardsUpdate?: (cards: CardModel[] | CardModelUnsaved[]) => void;
  emptyMessage?: string;
}

export function UnifiedCardList({
  cards,
  mode = "display",
  onCardsUpdate,
  emptyMessage = "No cards found for this section",
}: UnifiedCardListProps) {
  const [localCards, setLocalCards] =
    useState<(CardModel | CardModelUnsaved)[]>(cards);

  const handleCardUpdate = (
    index: number,
    updatedCard: CardModel | CardModelUnsaved
  ) => {
    const newCards = [...localCards];
    newCards[index] = updatedCard;
    setLocalCards(newCards);
    onCardsUpdate?.(newCards);
  };

  const handleCardDelete = (index: number) => {
    const newCards = localCards.filter((_, i) => i !== index);
    setLocalCards(newCards);
    onCardsUpdate?.(newCards);
  };

  const handleAddCard = () => {
    const newCard: CardModelUnsaved = {
      level: "knowledge",
      variants: [
        {
          type: "single_response",
          question: [""],
          answer: [""],
        },
      ],
    };

    const newCards = [...localCards, newCard];
    setLocalCards(newCards);
    onCardsUpdate?.(newCards);
  };

  if (localCards.length === 0) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground text-center py-4">{emptyMessage}</p>
        {onCardsUpdate && (
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={handleAddCard}
              className="text-sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add First Card
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {localCards.map((card, index) => (
        <UnifiedCard
          key={
            "id" in card
              ? card.id
              : `card-${index}-${card.variants.length}-${card.level}`
          }
          card={card}
          position={index + 1}
          mode={mode}
          onUpdate={
            onCardsUpdate
              ? (updatedCard) => handleCardUpdate(index, updatedCard)
              : undefined
          }
          onDelete={onCardsUpdate ? () => handleCardDelete(index) : undefined}
        />
      ))}

      {onCardsUpdate && (
        <div className="flex justify-center">
          <Button variant="outline" onClick={handleAddCard} className="text-sm">
            <Plus className="h-4 w-4 mr-1" />
            Add Card
          </Button>
        </div>
      )}
    </div>
  );
}
