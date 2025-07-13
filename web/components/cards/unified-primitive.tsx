import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardBlockPrimitive } from "@youwise/shared";
import { Plus, Trash2 } from "lucide-react";

interface UnifiedPrimitiveProps {
  value: CardBlockPrimitive;
  onChange?: (newValue: CardBlockPrimitive) => void;
  mode: "display" | "edit";
  placeholder?: string;
}

export function UnifiedPrimitive({
  value,
  onChange,
  mode,
  placeholder = "Enter text...",
}: UnifiedPrimitiveProps) {
  const handlePartChange = (index: number, newValue: string) => {
    if (!onChange) return;
    const newParts = [...value];
    newParts[index] = newValue;
    onChange(newParts);
  };

  const handleAddPart = () => {
    if (!onChange) return;
    onChange([...value, ""]);
  };

  const handleRemovePart = (index: number) => {
    if (!onChange || value.length <= 1) return;
    const newParts = value.filter((_, i) => i !== index);
    onChange(newParts);
  };

  if (mode === "display") {
    return (
      <div className="space-y-1">
        {value.length === 1 ? (
          <p className="text-sm">{value[0]}</p>
        ) : (
          <ul className="list-disc ml-6">
            {value.map((part, index) => (
              <li key={index} className="text-sm">
                {part}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  // Edit mode
  return (
    <div className="flex flex-row items-end flex-1">
      <div className="flex-1 space-y-2">
        {value.map((part, index) => (
          <div key={index} className="flex flex-row items-end flex-1">
            <Input
              value={part}
              onChange={(e) => handlePartChange(index, e.target.value)}
              placeholder={placeholder}
              className="flex-1"
            />

            {value.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemovePart(index)}
                className="px-2"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        ))}
      </div>

      <div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleAddPart}
          className="text-xs"
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
