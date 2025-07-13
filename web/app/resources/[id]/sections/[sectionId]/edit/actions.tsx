"use server";

import { getDatabase } from "@/lib/database";
import { getResourceSectionById } from "@/lib/db/resources";
import { CardModelUnsaved } from "@youwise/shared";
import { redirect } from "next/navigation";
import { z } from "zod/v4";

const updateSectionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  more_content: z.string().optional(),
  position: z.number().int().min(1),
});

export async function updateSectionAction(
  resourceId: string,
  sectionId: string,
  formData: FormData
) {
  try {
    const rawData = {
      title: formData.get("title"),
      content: formData.get("content"),
      more_content: formData.get("more_content") || undefined,
      position: parseInt(formData.get("position") as string),
    };

    const validatedData = updateSectionSchema.parse(rawData);

    const database = getDatabase();

    const updatedSection = await database
      .updateTable("resource_sections")
      .set({
        title: validatedData.title,
        content: validatedData.content,
        more_content: validatedData.more_content || null,
        position: validatedData.position,
        updated_at: new Date(),
      })
      .where("id", "=", sectionId)
      .where("resource_id", "=", resourceId)
      .returningAll()
      .executeTakeFirstOrThrow();

    return { success: true, section: updatedSection };
  } catch (error) {
    console.error("Error updating section:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update section",
    };
  }
}

export async function redirectToSection(resourceId: string, sectionId: string) {
  redirect(`/resources/${resourceId}/sections/${sectionId}`);
}

export async function updateCardAction(cardId: string, card: CardModelUnsaved) {
  try {
    const database = getDatabase();

    const updatedCard = await database
      .updateTable("cards")
      .set({
        variants: JSON.stringify(card.variants),
        level: card.level,
        updated_at: new Date(),
      })
      .where("id", "=", cardId)
      .returningAll()
      .executeTakeFirstOrThrow();

    return { success: true, card: updatedCard };
  } catch (error) {
    console.error("Error updating card:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update card",
    };
  }
}

export async function deleteCardAction(cardId: string) {
  try {
    const database = getDatabase();

    await database.deleteFrom("cards").where("id", "=", cardId).execute();

    return { success: true };
  } catch (error) {
    console.error("Error deleting card:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete card",
    };
  }
}

export async function createCardAction(
  sectionId: string,
  card: CardModelUnsaved
) {
  try {
    const database = getDatabase();

    const newCard = await database
      .insertInto("cards")
      .values({
        resource_section_id: sectionId,
        variants: JSON.stringify(card.variants),
        level: card.level,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return { success: true, card: newCard };
  } catch (error) {
    console.error("Error creating card:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create card",
    };
  }
}

export async function getResourceSectionByIdAction(sectionId: string) {
  try {
    const section = await getResourceSectionById(sectionId);

    return { success: true as const, section };
  } catch (error) {
    console.error("Error fetching section:", error);
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Failed to fetch section",
    };
  }
}
