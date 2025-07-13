import { Badge } from "@/components/ui/badge";
import { CardVariant } from "@youwise/shared";
import { AlertTriangle } from "lucide-react";

interface DisplayVariantIncompatibleProps {
  variant: CardVariant;
}

export function DisplayVariantIncompatible({
  variant,
}: DisplayVariantIncompatibleProps) {
  return (
    <div className="space-y-4 pt-1">
      <div className="flex items-center gap-2">
        <Badge variant="destructive" className="mr-1">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Incompatible
        </Badge>
      </div>

      <div className="p-4 border border-destructive/20 bg-destructive/5 rounded-lg">
        <details className="mt-2">
          <summary className="text-xs text-muted-foreground cursor-pointer">
            Show raw data
          </summary>
          <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto">
            {JSON.stringify(variant, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
}
