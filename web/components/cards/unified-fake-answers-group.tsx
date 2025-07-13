import { Button } from "@/components/ui/button";
import { CardBlockPrimitive } from "@youwise/shared";
import { Plus, Trash2 } from "lucide-react";
import { UnifiedPrimitive } from "./unified-primitive";

interface UnifiedFakeAnswersGroupProps {
  label?: string;
  fakeAnswers?: CardBlockPrimitive[]; // Array of fake answer groups
  mode: "display" | "edit";
  onUpdate: (index: number, newFakeAnswer: CardBlockPrimitive) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  placeholder?: string;
  className?: string;
}

export function UnifiedFakeAnswersGroup({
  label = "Fake Answers (Optional)",
  fakeAnswers = [],
  mode,
  onUpdate,
  onAdd,
  onRemove,
  placeholder = "Enter fake answer...",
  className = "",
}: UnifiedFakeAnswersGroupProps) {
  if (mode === "display") {
    if (!fakeAnswers || fakeAnswers.length === 0) return null;

    return (
      <div className={`flex flex-col gap-1 ${className}`}>
        <p className="font-medium text-sm">Fake answers:</p>
        <ul className="list-decimal ml-6">
          {fakeAnswers.map((fakeAnswer, index) => (
            <li key={index} className="text-sm">
              {fakeAnswer.join(" ")}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // Edit mode
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="text-sm font-medium">{label}</div>
      {fakeAnswers.map((fakeAnswer, index) => (
        <div key={index} className="flex flex-row items-center gap-2 w-full">
          <div className="flex">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(index)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <UnifiedPrimitive
            value={fakeAnswer}
            onChange={(newFakeAnswer) => onUpdate(index, newFakeAnswer)}
            mode={mode}
            placeholder={placeholder}
          />
        </div>
      ))}

      <Button variant="ghost" size="sm" onClick={onAdd}>
        <Plus className="h-4 w-4 mr-1" />
        Add Fake Answer
      </Button>
    </div>
  );
}
