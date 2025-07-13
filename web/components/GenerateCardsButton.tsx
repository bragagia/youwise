"use client";

import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

interface GenerateCardsButtonProps {
  sectionId: string;
  resourceId: string;
}

export function GenerateCardsButton({
  sectionId,
  resourceId,
}: GenerateCardsButtonProps) {
  const router = useRouter();

  const handleGenerate = () => {
    // Redirect directly to preview page - generation will happen there
    router.push(`/resources/${resourceId}/sections/${sectionId}/cards/preview`);
  };

  return (
    <Button onClick={handleGenerate} size="sm">
      <Sparkles className="h-4 w-4 mr-2" />
      Generate Cards
    </Button>
  );
}
