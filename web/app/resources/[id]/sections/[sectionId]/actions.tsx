"use server";

import { getServices } from "@/lib/database";
import { CardModelUnsaved } from "@youwise/shared";

export async function createCardAction(
  sectionId: string,
  card: CardModelUnsaved
) {
  try {
    const { db } = await getServices();
    const newCard = await db.cards.createCard(sectionId, card);
    return { success: true as const, card: newCard };
  } catch (error) {
    console.error("Error creating card:", error);
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Failed to create card",
    };
  }
}

export async function updateCardAction(cardId: string, card: CardModelUnsaved) {
  try {
    const { db } = await getServices();
    const updatedCard = await db.cards.updateCard(cardId, card);
    return { success: true as const, card: updatedCard };
  } catch (error) {
    console.error("Error updating card:", error);
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Failed to update card",
    };
  }
}

export async function deleteCardAction(cardId: string) {
  try {
    const { db } = await getServices();
    await db.cards.deleteCard(cardId);
    return { success: true as const };
  } catch (error) {
    console.error("Error deleting card:", error);
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Failed to delete card",
    };
  }
}

export async function getResourceSectionByIdAction(sectionId: string) {
  try {
    const { db } = await getServices();
    const section = await db.resources.getResourceSectionById(sectionId);

    return { success: true as const, section };
  } catch (error) {
    console.error("Error fetching section:", error);
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Failed to fetch section",
    };
  }
}
