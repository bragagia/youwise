"use server";

import { saveResource } from "@/lib/db/resources";
import { GeneratedResource, GeneratedResourceSchema } from "@/lib/schemas";
import { getDefaultAiProvider } from "@/services/ai-provider/types";

export async function generateResourceAction(formData: FormData) {
  try {
    const epub = formData.get("epub") as File;
    const prompt = formData.get("prompt") as string;

    if (!epub || !prompt) {
      return {
        success: false as const,
        error: "EPUB file and prompt are required",
      };
    }

    console.log("Received EPUB file:", epub.name, "with size:", epub.size);

    const aiProvider = getDefaultAiProvider();

    const response = (await aiProvider({
      queryId: "generate-resource",
      systemPrompt: prompt,
      input: [
        {
          file: epub,
        },
      ],
      responseValidator: GeneratedResourceSchema,
    })) as GeneratedResource;

    console.log("Generated resource:", response);

    return { success: true as const, data: response };
  } catch (error) {
    console.error("Failed to generate resource:", error);
    return {
      success: false as const,
      error:
        error instanceof Error ? error.message : "Failed to generate resource",
    };
  }
}

export async function saveResourceAction(resource: GeneratedResource) {
  try {
    const createdResource = await saveResource(resource);

    return { success: true as const, createdResource };
  } catch (error) {
    console.error("Error creating resource:", error);
    return {
      success: false as const,
      error:
        error instanceof Error ? error.message : "Failed to create resource",
    };
  }
}
