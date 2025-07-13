"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { CardModel, CardModelUnsaved, CardVariant } from "@youwise/shared";
import { Edit3, Plus, Save, Trash2, X } from "lucide-react";
import { useState } from "react";
import { UnifiedCardVariant } from "./unified-card-variant";

interface UnifiedCardProps {
  card: CardModel | CardModelUnsaved;
  position?: number;
  onUpdate?: (cardId: string, card: CardModelUnsaved) => Promise<void>;
  onDelete?: (cardId: string) => Promise<void>;
  // Props for new card creation
  isNewCard?: boolean;
  onCreate?: (card: CardModelUnsaved) => Promise<void>;
  onCancel?: () => void;
}

export function UnifiedCard({
  card,
  position,
  onUpdate,
  onDelete,
  isNewCard = false,
  onCreate,
  onCancel,
}: UnifiedCardProps) {
  const [isEditing, setIsEditing] = useState(isNewCard);
  const [localCard, setLocalCard] = useState<CardModel | CardModelUnsaved>(
    card
  );
  const [isSaving, setIsSaving] = useState(false);

  // We manage local state until save
  const handleCardUpdate = (updates: Partial<CardModel | CardModelUnsaved>) => {
    const updated = { ...localCard, ...updates };
    setLocalCard(updated);
  };

  const handleVariantUpdate = (index: number, variant: CardVariant) => {
    const newVariants = [...localCard.variants];
    newVariants[index] = variant;
    handleCardUpdate({ variants: newVariants });
  };

  const handleVariantDelete = (index: number) => {
    if (localCard.variants.length <= 1) {
      // If only one variant left, delete the whole card
      if (isNewCard) {
        onCancel?.();
      } else {
        handleDelete();
      }
      return;
    }

    const newVariants = localCard.variants.filter((_, i) => i !== index);
    handleCardUpdate({ variants: newVariants });
  };

  const handleAddVariant = () => {
    const newVariant: CardVariant = {
      type: "single_response",
      question: [""],
      answer: [""],
    };
    handleCardUpdate({ variants: [...localCard.variants, newVariant] });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (isSaving) return;

    setIsSaving(true);
    try {
      if (isNewCard && onCreate) {
        await onCreate(localCard);
      } else if (onUpdate && "id" in card) {
        await onUpdate(card.id, localCard);
        setIsEditing(false);
      }
    } catch {
      alert("Failed to save card. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (isNewCard) {
      onCancel?.();
    } else {
      setLocalCard(card);
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    if (isNewCard) {
      return;
    }

    if ("id" in card && onDelete) {
      try {
        await onDelete(card.id);
      } catch {
        alert("Failed to delete card. Please try again.");
      }
    }
  };

  const canEdit = onUpdate || isNewCard;
  const displayCard = localCard;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <CardTitle className="text-base flex items-center gap-2">
              {position && `Card ${position}`}
              {!position && "Card"}
            </CardTitle>

            {/* Level Display/Editor */}
            {isEditing ? (
              <Select
                value={displayCard.level}
                onValueChange={(value: CardModel["level"]) =>
                  handleCardUpdate({ level: value })
                }
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="core_concept">Core Concept</SelectItem>
                  <SelectItem value="knowledge">Knowledge</SelectItem>
                  <SelectItem value="example">Example</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Badge variant="outline">
                {displayCard.level.replace("_", " ")}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Edit/Save/Cancel buttons */}
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="text-green-600 hover:text-green-700"
                >
                  <Save className="h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              canEdit && (
                <Button variant="outline" size="sm" onClick={handleEdit}>
                  <Edit3 className="h-4 w-4" />
                </Button>
              )
            )}

            {/* Delete button */}
            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {displayCard.variants.map((variant, index) => (
          <div key={index}>
            <UnifiedCardVariant
              variant={variant}
              mode={isEditing ? "edit" : "display"}
              onUpdate={
                isEditing ? (v) => handleVariantUpdate(index, v) : undefined
              }
              onDelete={
                isEditing ? () => handleVariantDelete(index) : undefined
              }
            />

            {index < displayCard.variants.length - 1 && (
              <Separator className="mt-4 bg-gray-400" />
            )}
          </div>
        ))}

        {/* Add Variant in Edit Mode */}
        {isEditing && (
          <>
            <Separator className="bg-gray-300" />
            <div className="flex justify-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAddVariant}
                className="text-xs"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Variant
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
