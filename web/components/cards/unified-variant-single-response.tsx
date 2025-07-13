"use client";

import { UnifiedCardVariantSelector } from "@/components/cards/unified-card-variant";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardVariant, SingleResponseCardVariant } from "@youwise/shared";
import { ArrowRight } from "lucide-react";
import { UnifiedFakeAnswersGroup } from "./unified-fake-answers-group";
import { UnifiedPrimitive } from "./unified-primitive";

interface UnifiedSingleResponseVariantProps {
  variant: SingleResponseCardVariant;
  mode: "display" | "edit";
  onUpdate?: (variant: SingleResponseCardVariant) => void;
  onDelete?: () => void;
  handleTypeChange?: (variantType: CardVariant["type"]) => void;
}

export function UnifiedSingleResponseVariant({
  variant,
  mode,
  onUpdate,
  onDelete,
  handleTypeChange,
}: UnifiedSingleResponseVariantProps) {
  const handleUpdate = (updates: Partial<SingleResponseCardVariant>) => {
    const updated = { ...variant, ...updates };
    onUpdate?.(updated);
  };

  const handleFakeAnswersUpdate = (index: number, newFakeAnswer: string[]) => {
    const currentFakeAnswers = variant.fakeAnswers || [];
    const newFakeAnswers = [...currentFakeAnswers];
    newFakeAnswers[index] = newFakeAnswer;
    handleUpdate({ fakeAnswers: newFakeAnswers });
  };

  const addFakeAnswerGroup = () => {
    const currentFakeAnswers = variant.fakeAnswers || [];
    handleUpdate({ fakeAnswers: [...currentFakeAnswers, [""]] });
  };

  const removeFakeAnswerGroup = (index: number) => {
    const currentFakeAnswers = variant.fakeAnswers || [];
    const newFakeAnswers = currentFakeAnswers.filter((_, i) => i !== index);
    handleUpdate({
      fakeAnswers: newFakeAnswers.length > 0 ? newFakeAnswers : undefined,
    });
  };

  if (mode === "display") {
    return (
      <div className="space-y-4 pt-1">
        <div>
          <p className="font-medium">
            <Badge variant="secondary" className="mr-1">
              Single Response
            </Badge>
            {variant.question.join(" ")}
          </p>
        </div>

        <div className="flex flex-row gap-2">
          <ArrowRight size={16} className="shrink-0" />
          <div className="flex flex-col gap-2">
            <p className="text-sm">{variant.answer.join(" ")}</p>

            <UnifiedFakeAnswersGroup
              fakeAnswers={variant.fakeAnswers}
              mode={mode}
              onUpdate={handleFakeAnswersUpdate}
              onAdd={addFakeAnswerGroup}
              onRemove={removeFakeAnswerGroup}
            />
          </div>
        </div>

        {variant.more_infos && (
          <div className="text-sm text-gray-700 bg-muted p-2 rounded-lg border border-gray-300">
            {variant.more_infos.map((info, index) => (
              <p key={index} className="mb-1 last:mb-0">
                {info}
              </p>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Edit mode
  return (
    <div className="space-y-4 pt-1">
      {/* Type Badge and Delete Button */}
      <div className="flex items-center justify-between">
        {mode === "edit" && onUpdate && (
          <UnifiedCardVariantSelector
            variant={variant}
            mode={mode}
            onUpdate={handleTypeChange}
          />
        )}

        {onDelete && (
          <Button
            variant="outline"
            size="sm"
            onClick={onDelete}
            className="text-red-500 hover:text-red-700"
          >
            Delete Variant
          </Button>
        )}
      </div>

      {/* Question */}
      <UnifiedPrimitive
        value={variant.question}
        onChange={(newQuestion) => handleUpdate({ question: newQuestion })}
        mode={mode}
        placeholder="Enter question..."
      />

      {/* Answer */}
      <UnifiedPrimitive
        value={variant.answer}
        onChange={(newAnswer) => handleUpdate({ answer: newAnswer })}
        mode={mode}
        placeholder="Enter answer..."
      />

      {/* Fake Answers */}
      <UnifiedFakeAnswersGroup
        fakeAnswers={variant.fakeAnswers}
        mode={mode}
        onUpdate={handleFakeAnswersUpdate}
        onAdd={addFakeAnswerGroup}
        onRemove={removeFakeAnswerGroup}
      />

      {/* More Info */}
      {variant.more_infos !== undefined && (
        <UnifiedPrimitive
          value={variant.more_infos}
          onChange={(newMoreInfos) =>
            handleUpdate({ more_infos: newMoreInfos })
          }
          mode={mode}
          placeholder="Enter additional info..."
        />
      )}

      {/* Add More Info Section */}
      {variant.more_infos === undefined && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleUpdate({ more_infos: [""] })}
          className="w-full"
        >
          Add Additional Info Section
        </Button>
      )}
    </div>
  );
}
