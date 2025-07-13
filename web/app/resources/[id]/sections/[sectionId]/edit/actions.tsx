"use server";

import { getServices } from "@/lib/database";
import { redirect } from "next/navigation";
import { z } from "zod/v4";

const updateSectionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  more_content: z.string().optional(),
  position: z.number().int().min(1),
});

export async function updateSectionAction(
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

    const { db } = await getServices();
    const updatedSection = await db.resources.updateResourceSection(sectionId, {
      title: validatedData.title,
      content: validatedData.content,
      more_content: validatedData.more_content || null,
      position: validatedData.position,
    });

    return { success: true as const, section: updatedSection };
  } catch (error) {
    console.error("Error updating section:", error);
    return {
      success: false as const,
      error:
        error instanceof Error ? error.message : "Failed to update section",
    };
  }
}

export async function redirectToSection(resourceId: string, sectionId: string) {
  redirect(`/resources/${resourceId}/sections/${sectionId}`);
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
