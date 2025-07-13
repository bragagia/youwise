"use client";

import { Button } from "@/components/ui/button";
import { CardModel, CardModelUnsaved } from "@youwise/shared";
import { Plus } from "lucide-react";
import { useState } from "react";
import { UnifiedCard } from "./unified-card";

interface UnifiedCardListProps {
  cards: CardModel[];
  onCreateCard?: (card: CardModelUnsaved) => Promise<void>;
  onUpdateCard?: (cardId: string, card: CardModelUnsaved) => Promise<void>;
  onDeleteCard?: (cardId: string) => Promise<void>;
}

export function UnifiedCardList({
  cards,
  onCreateCard,
  onUpdateCard,
  onDeleteCard,
}: UnifiedCardListProps) {
  const [newCard, setNewCard] = useState<CardModelUnsaved | null>(null);

  const handleAddCard = () => {
    const defaultCard: CardModelUnsaved = {
      level: "knowledge",
      variants: [
        {
          type: "single_response",
          question: [""],
          answer: [""],
        },
      ],
    };

    setNewCard(defaultCard);
  };

  const handleCreateCard = async (newCard: CardModelUnsaved) => {
    if (onCreateCard) {
      try {
        console.log(newCard);
        await onCreateCard(newCard);

        setNewCard(null);
      } catch {
        alert("Failed to save card. Please try again.");
      }
    }
  };

  const handleCancelNewCard = () => {
    setNewCard(null);
  };

  // Check if we should show empty state
  const hasCards = cards.length > 0 || newCard !== null;

  if (!hasCards) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground text-center py-4">
          No cards yet. Click &apos;Add New Card&apos; to get started.
        </p>
        {onCreateCard && (
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
      {cards.map((card, index) => (
        <UnifiedCard
          key={card.id}
          card={card}
          position={index + 1}
          onUpdate={onUpdateCard}
          onDelete={onDeleteCard}
        />
      ))}

      {newCard && (
        <UnifiedCard
          key="new-card"
          card={newCard}
          position={cards.length + 1}
          isNewCard={true}
          onUpdate={async (_, updatedCard) => setNewCard(updatedCard)}
          onCreate={handleCreateCard}
          onCancel={handleCancelNewCard}
        />
      )}

      {onCreateCard && !newCard && (
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
