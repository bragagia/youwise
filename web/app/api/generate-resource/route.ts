import { GeneratedResource, GeneratedResourceSchema } from "@/lib/schemas";
import { getDefaultAiProvider } from "@/services/ai-provider/types";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("epub") as File;
    const prompt = formData.get("prompt") as string;

    if (!file || !prompt) {
      return NextResponse.json(
        { error: "EPUB file and prompt are required" },
        { status: 400 }
      );
    }

    //const arraybuffer = await file.arrayBuffer();

    console.log("Received EPUB file:", file.name, "with size:", file.size);

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
          file: file,
        },
      ],
      responseValidator: GeneratedResourceSchema,
    })) as GeneratedResource;

    console.log("Generated resource:", response);

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error generating resource:", error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: "Failed to generate resource" },
      { status: 500 }
    );
  }
}
