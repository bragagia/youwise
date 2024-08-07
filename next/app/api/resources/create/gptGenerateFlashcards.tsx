import { BasicQuestion } from "@/app/api/resources/create/gptExtractBasicQuestions";
import { newOpenAI } from "@/lib/openai";
import { PrismaClient } from "@prisma/client";
import { ChatModel } from "openai/resources/index.mjs";
import { CardGPTOutput, cardGPTOutputSchema } from "youwise-shared/api";
import { z } from "zod";

const FlashcardsOutputSchema = z.object({
  cards: z.array(cardGPTOutputSchema),
});

type FlashcardsOutput = z.infer<typeof FlashcardsOutputSchema>;

export async function GPTGenerateFlashcards(
  userId: string,
  basicQuestions: BasicQuestion[]
): Promise<CardGPTOutput[]> {
  const openai = newOpenAI();
  const prisma = new PrismaClient();

  const model: ChatModel = "gpt-4o";
  const chatCompletion = await openai.chat.completions.create({
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: PROMPT },
      { role: "user", content: JSON.stringify(basicQuestions) },
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
    !chatCompletion.choices[0].message.content
  ) {
    throw new Error("No completion");
  }

  if (chatCompletion.choices[0].finish_reason !== "stop") {
    throw new Error(
      "Bad finish reason:" + chatCompletion.choices[0].finish_reason
    );
  }

  let output: FlashcardsOutput;
  try {
    output = FlashcardsOutputSchema.parse(
      JSON.parse(chatCompletion.choices[0].message.content)
    );

    console.log(JSON.stringify(output, null, 2));
  } catch (e) {
    console.log("input: ", chatCompletion.choices[0].message.content);

    console.log("Invalid completion: ", e);
    throw e;
  }

  return output.cards;
}

const PROMPT_GENERATE_FLASHCARDS_JSON = `
{
  cards: [
    {
      "variants": [
        {
          "type": "classic",
          "question": "What is the capital of France?",
          "answer": "Paris",
          "fakeAnswers": ["London", "Lyon", "Marseille", "Berlin", "Madrid"]
        },
        {
          "type": "classic",
          "question": "Of which country is Paris the capital?",
          "answer": "France",
          "fakeAnswers": ["Italy", "Spain", "Germany", "Belgium", "Portugal"]
        }
      ]
    },
    {
      "variants": [
        {
          "type": "classic",
          "question": "What is the role of the mitochondrion?",
          "answer": "The powerhouse of the cell",
          "fakeAnswers": ["The membrane of the cell", "The center of the cell", "The guardian of the cell"]
        },
        {
          "type": "classic",
          "question": "What is referred to as the powerhouse of the cell?",
          "answer": "The mitochondrion.",
          "fakeAnswers": ["The nucleus.", "The ribosome.", "The lysosome."]
        }
      ]
    },
    {
      "variants": [
        {
          "type": "classic",
          "question": "Name the process by which plants make their food.",
          "answer": "Photosynthesis",
          "fakeAnswers": ["Respiration", "Transpiration", "Evaporation", "Condensation", "Precipitation"]
        },
        {
          "type": "classic",
          "question": "What is photosynthesis?",
          "answer": "The process by which plants make their food.",
        }
      ]
    },
    {
      "variants": [
        {
          "type": "classic",
          "question": "Who wrote 'Hamlet'?",
          "answer": "William Shakespeare",
          "fakeAnswers": ["Christopher Marlowe", "Ben Jonson", "John Webster", "Thomas Kyd", "Francis Bacon"]
        },
      ]
    },
    {
      "variants": [
        {
          "type": "classic",
          "question": "At what temperature does water boil?",
          "answer": "100 degrees Celsius",
          "fakeAnswers": ["90 degrees Celsius", "80 degrees Celsius", "70 degrees Celsius", "110 degrees Celsius", "120 degrees Celsius"]
        },
        {
          "type": "classic",
          "question": "What special happens at 100 degrees Celsius?",
          "answer": "Water boil",
        }
      ]
    },
    {
      "variants": [
        {
          "type": "text",
          "title": ["Helen Keller quote"],
          "text": [
            {
              "id": "",
              "part": ["The best and most beautiful things in the world"]
            },
            {
              "id": "",
              "part": ["cannot be seen or even touched"]
            },
            {
              "id": "",
              "part": ["- they must be felt with the heart."]
            }
          ]
        }
      ]
    }
  ]
}`;

const PROMPT_GENERATE_FLASHCARDS_TYPES = `
export type Card = {
  variants: CardVariant[]; // Each card should have a single variant by default, but if the piece of knowledge must be known in both side, there should be a reversed variant (eg: What's the capital of France? Paris + the variant: Of which country is Paris the capital? France)
};

export type CardVariant = ClassicCardVariant | TextCardVariant;

// * ClassicCardVariant are used to memorize standalone facts
export type ClassicCardVariant = {
  type: "classic";
  question: CardBlocks; // Eg: "What is the capital of France?"
  answer: CardBlocks; // Eg: "Paris"

  fakeAnswers?: CardBlocks[]; // eg: ["London", "Lyon", "Marseille", "Berlin", "Madrid"] -> This field should be used whenever possible to allow the card to be sometimes presented as a quiz. If the field is used, there should be at least 3 fake answers, ideally 6 to change them every time the card is presented. The fake answers should be plausible, similar in length and format to the true answer, and not too easy to guess. If the answer is yes or no, there can be only 1 fake answer.
};

// * TextCardVariant are used to memorize long texts or quote by heart. The text is cut in parts.
export type TextCardVariant = {
  type: "text";
  title: CardBlocks;
  text: TextCardPart[];
};

export type TextCardPart = {
  id: string; // Unique ID to identify the part (I an AI generate those parts, it must always fill this field with an empty string "")
  part: CardBlocks; // Must be smart cut by AI to be at least multiple words but not more than 10
}[];

// * Card blocks
export type CardBlocks = CardBlockPrimitive | CardBlockPrimitive[];
export type CardBlockPrimitive = string;
`;

const PROMPT = `
You are a very smart and meticulous teacher preparing flashcards for an exam for your students.

You will receive in the next message the content of an exam with a list of questions with their response as input. The students will get an exam with similar question but not exactly those ones.

You must create an extensive set of flashcards covering everything that the student should have understood from the subject covered by the given list of question and answer. Each students will only get a random subset of the flashcards, so the more extensive you are, the better. Don't be afraid to create hundreds of flashcards if necessary. You may create zero, one or multiple flashcards for a given exam answer, feel free to create them as you see fit.

You will only create 10 flashcards at a time due to system limitations, never more. I will ask you as many times as necessary to cover all the questions. If you have finished, simply respond with an empty cards array.

You will output a JSON containing the created flashcards following that exact JSON format.
${PROMPT_GENERATE_FLASHCARDS_JSON}

For better clarity, here is the JSON defined in typescript types with documentation, you must NEVER deviate from the exact typescript types or you will have to restart the work and you must follow the documentation for each field:
${PROMPT_GENERATE_FLASHCARDS_TYPES}
`;
