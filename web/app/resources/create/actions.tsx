"use server";

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
      systemPrompt:
        "You are an educational content extractor. You will receive an EPUB file and extract educational content according to the user's prompt.",
      input: [
        {
          text: prompt,
        },
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
