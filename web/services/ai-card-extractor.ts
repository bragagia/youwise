"use server";

import {
  GeneratedCardsResponse,
  GeneratedCardsResponseSchema,
} from "@youwise/shared";
import ExtractCardsFromSectionPrompt from "@/services/ai-prompts/extract-cards-from-section.md";
import ExtractQAFromSectionPrompt from "@/services/ai-prompts/extract-qa-from-section.md";
import { getResourceStringForAI } from "@/services/ai-prompts/get-resource-string-for-ai";
import { getDefaultAiProvider } from "@/services/ai-provider/types";
import { ResourceWithSections } from "@/types/resources";

export async function extractQAFromSection(
  resource: ResourceWithSections,
  sectionId: string
) {
  const fullResourceContent = getResourceStringForAI(resource, sectionId);

  const systemPrompt = ExtractQAFromSectionPrompt;

  const aiProvider = getDefaultAiProvider();
  const qaResponse = await aiProvider({
    queryId: "extract-qa-from-section",
    systemPrompt,
    input: [{ text: fullResourceContent }],
  });

  return qaResponse as string;
}

export async function ExtractCardsFromSection(
  resource: ResourceWithSections,
  sectionId: string,
  qaMarkdown: string
): Promise<GeneratedCardsResponse> {
  const fullResourceContent = getResourceStringForAI(resource, sectionId);

  const systemPrompt = ExtractCardsFromSectionPrompt;

  const aiProvider = getDefaultAiProvider();
  const cardsResponse = await aiProvider({
    queryId: "extract-cards-from-section",
    systemPrompt,
    input: [{ text: fullResourceContent }, { text: qaMarkdown }],
    responseValidator: GeneratedCardsResponseSchema,
  });

  const validatedCards = cardsResponse as GeneratedCardsResponse;

  return validatedCards;
}
