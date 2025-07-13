"use server";

import { getServices } from "@/lib/database";
import {
  ExtractCardsFromSection,
  extractQAFromSection,
} from "@/services/ai-card-extractor";
import { CardModelUnsaved } from "@youwise/shared";
import { redirect } from "next/navigation";

export async function extractQAFromSectionAction(
  resourceId: string,
  sectionId: string
) {
  try {
    const { db } = await getServices();
    const resource = await db.resources.getResourceById(resourceId);
    if (!resource) {
      throw new Error(`Resource not found: ${resourceId}`);
    }

    const qaMarkdown = await extractQAFromSection(resource, sectionId);

    return {
      success: true as const,
      qaMarkdown,
      sectionId,
    };
  } catch (error) {
    console.error(
      `[Server Action] Error extracting Q&A for section ${sectionId}:`,
      error
    );

    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Failed to extract Q&A",
    };
  }
}

export async function extractCardFromSectionAction(
  resourceId: string,
  sectionId: string,
  qaMarkdown: string
) {
  try {
    const { db } = await getServices();
    const resource = await db.resources.getResourceById(resourceId);
    if (!resource) {
      throw new Error(`Resource not found: ${resourceId}`);
    }

    const generatedCards = await ExtractCardsFromSection(
      resource,
      sectionId,
      qaMarkdown
    );

    return {
      success: true as const,
      cards: generatedCards.cards,
    };
  } catch (error) {
    console.error(`[Server Action] Error converting Q&A to cards:`, error);

    return {
      success: false as const,
      error:
        error instanceof Error
          ? error.message
          : "Failed to convert Q&A to cards",
    };
  }
}

export async function saveCardsAction(
  resourceId: string,
  sectionId: string,
  cards: CardModelUnsaved[]
) {
  try {
    const { db } = await getServices();
    await db.cards.saveGeneratedCards(sectionId, cards);
  } catch (error) {
    console.error(
      `[Server Action] Error saving cards for section ${sectionId}:`,
      error
    );

    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Failed to save cards",
    };
  }

  redirect(`/resources/${resourceId}/sections/${sectionId}`);
}
