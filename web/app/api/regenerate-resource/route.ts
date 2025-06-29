import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"
import { GeneratedResourceSchema } from "@/lib/schemas"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("epub") as File
    const prompt = formData.get("prompt") as string
    const resourceId = formData.get("resourceId") as string

    if (!file || !prompt || !resourceId) {
      return NextResponse.json({ error: "EPUB file, prompt, and resource ID are required" }, { status: 400 })
    }

    // Convert file to base64 for OpenAI
    const bytes = await file.arrayBuffer()
    const base64 = Buffer.from(bytes).toString("base64")

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an educational content extractor. You will receive an EPUB file and extract educational content according to the user's prompt. Always respond with valid JSON matching the required schema.`,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `${prompt}\n\nEPUB file (base64): ${base64}`,
            },
          ],
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw new Error("No response from OpenAI")
    }

    // Parse and validate the response
    const parsedContent = JSON.parse(content)
    const validatedResource = GeneratedResourceSchema.parse(parsedContent)

    return NextResponse.json(validatedResource)
  } catch (error) {
    console.error("Error regenerating resource:", error)

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ error: "Failed to regenerate resource" }, { status: 500 })
  }
}
