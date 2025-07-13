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
import { Plus, X } from "lucide-react";
import { UnifiedCardVariant } from "./unified-card-variant";

interface UnifiedCardProps {
  card: CardModel | CardModelUnsaved;
  position?: number;
  mode?: "display" | "edit";
  onUpdate?: (card: CardModel | CardModelUnsaved) => void;
  onDelete?: () => void;
}

export function UnifiedCard({
  card,
  position,
  mode = "display",
  onUpdate,
  onDelete,
}: UnifiedCardProps) {
  const handleCardUpdate = (updates: Partial<CardModel | CardModelUnsaved>) => {
    const updated = { ...card, ...updates };
    onUpdate?.(updated);
  };

  const handleVariantUpdate = (index: number, variant: CardVariant) => {
    const newVariants = [...card.variants];
    newVariants[index] = variant;
    handleCardUpdate({ variants: newVariants });
  };

  const handleVariantDelete = (index: number) => {
    if (card.variants.length <= 1) {
      // If only one variant left, delete the whole card
      onDelete?.();
      return;
    }

    const newVariants = card.variants.filter((_, i) => i !== index);
    handleCardUpdate({ variants: newVariants });
  };

  const handleAddVariant = () => {
    const newVariant: CardVariant = {
      type: "single_response",
      question: [""],
      answer: [""],
    };
    handleCardUpdate({ variants: [...card.variants, newVariant] });
  };

  const isEditing = mode === "edit";

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
                value={card.level}
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
              <Badge variant="outline">{card.level.replace("_", " ")}</Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={onDelete}
                className="text-red-500 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {card.variants.map((variant, index) => (
          <div key={index}>
            <UnifiedCardVariant
              variant={variant}
              mode={mode}
              onUpdate={
                isEditing ? (v) => handleVariantUpdate(index, v) : undefined
              }
              onDelete={
                isEditing ? () => handleVariantDelete(index) : undefined
              }
            />
            {index < card.variants.length - 1 && (
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
