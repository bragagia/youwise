"use client";

import {
  extractCardFromSectionAction,
  extractQAFromSectionAction,
  saveCardsAction,
} from "@/app/resources/[id]/sections/[sectionId]/cards/preview/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Loader2, Wand2 } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import Markdown from "react-markdown";

interface CardsPreviewClientProps {
  resourceId: string;
  sectionId: string;
}

type GenerationStep = "ready" | "extracting-qa" | "converting-cards";

export function CardsPreviewClient({
  resourceId,
  sectionId,
}: CardsPreviewClientProps) {
  const [step, setStep] = useState<GenerationStep>("ready");
  const [qaMarkdown, setQaMarkdown] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleDiscard = async () => {
    redirect(`/resources/${resourceId}/sections/${sectionId}`);
  };

  const generateCards = async () => {
    setStep("extracting-qa");
    setError(null);
    setQaMarkdown("");

    const qaResult = await extractQAFromSectionAction(resourceId, sectionId);

    if (!qaResult.success) {
      setError(qaResult.error);
      return;
    }

    setQaMarkdown(qaResult.qaMarkdown);
    setStep("converting-cards");

    const cardsResult = await extractCardFromSectionAction(
      resourceId,
      sectionId,
      qaResult.qaMarkdown
    );

    if (!cardsResult.success) {
      setError(cardsResult.error);
      return;
    }

    await saveCardsAction(resourceId, sectionId, cardsResult.cards);
    router.push(`/resources/${resourceId}/sections/${sectionId}`);
  };

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Error Generating Cards
          </CardTitle>
        </CardHeader>

        <CardContent className="py-8">
          <div className="text-center space-y-4">
            <p className="text-sm max-w-md mx-auto">{error}</p>

            <Button variant="outline" onClick={handleDiscard}>
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === "ready") {
    return (
      <div className="flex items-center justify-center h-full">
        <Button onClick={generateCards} className="flex items-center gap-2">
          <Wand2 className="h-4 w-4" />
          Generate Cards
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Q&A Extraction
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="prose prose-sm max-w-none">
            {qaMarkdown ? (
              <Markdown>{qaMarkdown}</Markdown>
            ) : (
              <div className="mx-auto w-16 h-16 relative">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {step === "converting-cards" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Converting to Cards
            </CardTitle>
          </CardHeader>
          <CardContent className="py-6">
            <div className="mx-auto w-16 h-16 relative">
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
