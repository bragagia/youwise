"use client";

import { UnifiedCardVariantSelector } from "@/components/cards/unified-card-variant";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardVariant, OrderedListCardVariant } from "@youwise/shared";
import { ArrowRight } from "lucide-react";
import { UnifiedFakeAnswersGroup } from "./unified-fake-answers-group";
import { UnifiedPrimitive } from "./unified-primitive";

interface UnifiedOrderedListVariantProps {
  variant: OrderedListCardVariant;
  mode: "display" | "edit";
  onUpdate?: (variant: OrderedListCardVariant) => void;
  onDelete?: () => void;
  handleTypeChange?: (variantType: CardVariant["type"]) => void;
}

export function UnifiedOrderedListVariant({
  variant,
  mode,
  onUpdate,
  onDelete,
  handleTypeChange,
}: UnifiedOrderedListVariantProps) {
  const handleUpdate = (updates: Partial<OrderedListCardVariant>) => {
    const updated = { ...variant, ...updates };
    onUpdate?.(updated);
  };

  const handleAnswerUpdate = (answerIndex: number, newAnswer: string[]) => {
    const newAnswers = [...variant.answers];
    newAnswers[answerIndex] = {
      ...newAnswers[answerIndex],
      answer: newAnswer,
    };
    handleUpdate({ answers: newAnswers });
  };

  const addAnswer = () => {
    handleUpdate({
      answers: [...variant.answers, { answer: [""], fakeAnswers: undefined }],
    });
  };

  const removeAnswer = (index: number) => {
    if (variant.answers.length > 1) {
      const newAnswers = variant.answers.filter((_, i) => i !== index);
      handleUpdate({ answers: newAnswers });
    }
  };

  const handleFakeAnswersUpdate = (
    answerIndex: number,
    fakeGroupIndex: number,
    newFakeAnswer: string[]
  ) => {
    const newAnswers = [...variant.answers];
    const currentFakeAnswers = newAnswers[answerIndex].fakeAnswers || [];
    const newFakeAnswers = [...currentFakeAnswers];
    newFakeAnswers[fakeGroupIndex] = newFakeAnswer;
    newAnswers[answerIndex] = {
      ...newAnswers[answerIndex],
      fakeAnswers: newFakeAnswers,
    };
    handleUpdate({ answers: newAnswers });
  };

  const addFakeAnswer = (answerIndex: number) => {
    const newAnswers = [...variant.answers];
    const currentFakeAnswers = newAnswers[answerIndex].fakeAnswers || [];
    newAnswers[answerIndex] = {
      ...newAnswers[answerIndex],
      fakeAnswers: [...currentFakeAnswers, [""]],
    };
    handleUpdate({ answers: newAnswers });
  };

  const removeFakeAnswer = (answerIndex: number, fakeGroupIndex: number) => {
    const newAnswers = [...variant.answers];
    const currentFakeAnswers = newAnswers[answerIndex].fakeAnswers || [];
    const newFakeAnswers = currentFakeAnswers.filter(
      (_, i) => i !== fakeGroupIndex
    );
    newAnswers[answerIndex] = {
      ...newAnswers[answerIndex],
      fakeAnswers: newFakeAnswers.length > 0 ? newFakeAnswers : undefined,
    };
    handleUpdate({ answers: newAnswers });
  };

  if (mode === "display") {
    return (
      <div className="space-y-4 pt-1">
        <div>
          <p className="font-medium">
            <Badge variant="secondary" className="mr-1">
              {variant.type === "split_sentence"
                ? "Split Sentence"
                : "Numbered List"}
            </Badge>
            {variant.question.join(" ")}
          </p>
        </div>

        <div className="flex flex-row items-start gap-2">
          <ArrowRight size={16} className="shrink-0 mt-0.5" />
          <div className="flex flex-col gap-3">
            {variant.answers.map((answerObj, index) => (
              <div key={index} className="flex flex-col gap-2">
                <div className="flex items-start gap-2">
                  <Badge variant="secondary" className="text-xs min-w-fit">
                    {index + 1}
                  </Badge>
                  <p className="text-sm font-medium">
                    {answerObj.answer.join(" ")}
                  </p>
                </div>

                {answerObj.fakeAnswers && answerObj.fakeAnswers.length > 0 && (
                  <div className="ml-8 flex flex-col gap-1">
                    <p className="font-medium text-xs">Fake answers:</p>
                    <ul className="list-decimal ml-4">
                      {answerObj.fakeAnswers.map((fake, fakeIndex) => (
                        <li key={fakeIndex} className="text-xs">
                          {fake.join(" ")}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
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

      {/* Ordered Answers */}
      <div className="space-y-2">
        <div className="text-sm font-medium">
          {variant.type === "split_sentence"
            ? "Sentence Parts"
            : "Ordered Items"}
        </div>
        {variant.answers.map((answerObj, answerIndex) => (
          <div key={answerIndex} className="border rounded p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">
                Item {answerIndex + 1}
              </span>
              {variant.answers.length > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeAnswer(answerIndex)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove item
                </Button>
              )}
            </div>

            {/* Answer */}
            <UnifiedPrimitive
              value={answerObj.answer}
              onChange={(newAnswer) =>
                handleAnswerUpdate(answerIndex, newAnswer)
              }
              mode={mode}
              placeholder="Enter answer..."
            />

            {/* Fake Answers for this position */}
            <UnifiedFakeAnswersGroup
              label={`Fake Answers for item ${answerIndex + 1} (Optional)`}
              fakeAnswers={answerObj.fakeAnswers}
              mode={mode}
              onUpdate={(fakeGroupIndex, newFakeAnswer) =>
                handleFakeAnswersUpdate(
                  answerIndex,
                  fakeGroupIndex,
                  newFakeAnswer
                )
              }
              onAdd={() => addFakeAnswer(answerIndex)}
              onRemove={(fakeGroupIndex) =>
                removeFakeAnswer(answerIndex, fakeGroupIndex)
              }
            />
          </div>
        ))}
        <Button
          variant="ghost"
          size="sm"
          onClick={addAnswer}
          className="w-full"
        >
          Add item
        </Button>
      </div>

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
