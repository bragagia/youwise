"use client";

import { DisplayVariantIncompatible } from "@/components/cards/variant-incompatible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CardVariant } from "@youwise/shared";
import { UnifiedOrderedListVariant } from "./unified-variant-ordered-list";
import { UnifiedSingleResponseVariant } from "./unified-variant-single-response";
import { UnifiedUnorderedListVariant } from "./unified-variant-unordered-list";

interface UnifiedCardVariantProps {
  variant: CardVariant;
  mode: "display" | "edit";
  onUpdate?: (variant: CardVariant) => void;
  onDelete?: () => void;
}

export function UnifiedCardVariant({
  variant,
  mode,
  onUpdate,
  onDelete,
}: UnifiedCardVariantProps) {
  const handleTypeChange = (newType: CardVariant["type"]) => {
    if (newType === variant.type || !onUpdate) return;

    // Simple type conversion - preserve what we can
    let newVariant: CardVariant;

    switch (newType) {
      case "single_response":
        newVariant = {
          type: "single_response",
          question: variant.question,
          answer: variant.type === "single_response" ? variant.answer : [""],
          fakeAnswers:
            variant.type === "single_response" ||
            variant.type === "unordered_list"
              ? variant.fakeAnswers
              : undefined,
          more_infos: variant.more_infos,
        };
        break;

      case "unordered_list":
        newVariant = {
          type: "unordered_list",
          question: variant.question,
          answers:
            variant.type === "unordered_list"
              ? variant.answers
              : variant.type === "single_response"
              ? [variant.answer]
              : [[""]],
          fakeAnswers:
            variant.type === "single_response" ||
            variant.type === "unordered_list"
              ? variant.fakeAnswers
              : undefined,
          more_infos: variant.more_infos,
        };
        break;

      case "split_sentence":
      case "numbered_list":
        newVariant = {
          type: newType,
          question: variant.question,
          answers:
            variant.type === "split_sentence" ||
            variant.type === "numbered_list"
              ? variant.answers
              : variant.type === "single_response"
              ? [
                  {
                    answer: variant.answer,
                    fakeAnswers: variant.fakeAnswers,
                  },
                ]
              : variant.type === "unordered_list"
              ? variant.answers.map((answer) => ({
                  answer,
                  fakeAnswers: variant.fakeAnswers,
                }))
              : [{ answer: [""], fakeAnswers: undefined }],
          more_infos: variant.more_infos,
        };
        break;

      default:
        return; // Unknown type, don't change
    }

    onUpdate(newVariant);
  };

  switch (variant.type) {
    case "single_response":
      return (
        <UnifiedSingleResponseVariant
          variant={variant}
          mode={mode}
          onUpdate={onUpdate}
          onDelete={onDelete}
          handleTypeChange={handleTypeChange}
        />
      );

    case "unordered_list":
      return (
        <UnifiedUnorderedListVariant
          variant={variant}
          mode={mode}
          onUpdate={onUpdate}
          onDelete={onDelete}
          handleTypeChange={handleTypeChange}
        />
      );

    case "split_sentence":
    case "numbered_list":
      return (
        <UnifiedOrderedListVariant
          variant={variant}
          mode={mode}
          onUpdate={onUpdate}
          onDelete={onDelete}
          handleTypeChange={handleTypeChange}
        />
      );

    default:
      return <DisplayVariantIncompatible variant={variant} />;
  }
}

export function UnifiedCardVariantSelector({
  variant,
  mode,
  onUpdate,
}: {
  variant: CardVariant;
  mode: "display" | "edit";
  onUpdate?: (variantType: CardVariant["type"]) => void;
}) {
  if (mode === "display") return null;

  return (
    <div className="space-y-2">
      <Select value={variant.type} onValueChange={onUpdate}>
        <SelectTrigger className="w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="single_response">Single Response</SelectItem>
          <SelectItem value="unordered_list">Unordered List</SelectItem>
          <SelectItem value="split_sentence">Split Sentence</SelectItem>
          <SelectItem value="numbered_list">Numbered List</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
