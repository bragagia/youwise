import { newOpenAI } from "@/lib/openai";
import { PrismaClient } from "@prisma/client";
import { ChatModel } from "openai/resources/index.mjs";
import { z } from "zod";

const BasicQuestionOutputSchema = z.object({
  list: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
    })
  ),
});

type BasicQuestionOutput = z.infer<typeof BasicQuestionOutputSchema>;
export type BasicQuestion = BasicQuestionOutput["list"][0];

export async function GPTExtractQuestions(
  userId: string,
  ressource: string
): Promise<BasicQuestion[]> {
  const openai = newOpenAI();
  const prisma = new PrismaClient();

  const model: ChatModel = "gpt-4o";
  const chatCompletion = await openai.chat.completions.create({
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: PROMPT },
      { role: "user", content: ressource },
    ],
    model: model,
  });

  if (chatCompletion.usage) {
    await prisma.aIUsage.create({
      data: {
        userId: userId,
        model: model,
        promptTokens: chatCompletion.usage.prompt_tokens,
        responseTokens: chatCompletion.usage.completion_tokens,
      },
    });
  }

  if (
    !chatCompletion.choices ||
    chatCompletion.choices.length === 0 ||
    chatCompletion.choices[0].finish_reason !== "stop" ||
    !chatCompletion.choices[0].message.content
  ) {
    throw new Error("No completion");
  }

  let output: BasicQuestionOutput;
  try {
    output = BasicQuestionOutputSchema.parse(
      JSON.parse(chatCompletion.choices[0].message.content)
    );

    console.log(JSON.stringify(output, null, 2));
  } catch (e) {
    console.log(
      "Invalid completion",
      chatCompletion.choices[0].message.content
    );
    throw new Error("Invalid completion");
  }

  return output.list;
}

const PROMPT = `
You are a very smart and meticulous teacher preparing questions from a ressource for your students.

- You must create an extensive set of questions covering everything that the student should have understood from the ressource. Each students will only get a random subset of the questions, so the more extensive you are, the better. Don't be afraid to create hundreds of questions if necessary.
- Don't forget to create high level question to ensure the students have got a deep understanding of the ressource and not only superficial knowledge.
- Avoid creating duplicates questions. But it's okay if a high level question also covers a low level question.
- Each question must be understandable by itself, without any context about the ressource or the other questions. For example you avoid referencing things outside of the questions with "it" or "this".

You will output a JSON following that exact format:
{
    list: {
        question: string;
        answer: string;
    }[];
}

Only output JSON in your message, nothing else.
`;
