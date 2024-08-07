import { GPTExtractQuestions } from "@/app/api/resources/create/gptExtractBasicQuestions";
import { GPTGenerateFlashcards } from "@/app/api/resources/create/gptGenerateFlashcards";
import { PrivateEndpointWrapper } from "@/lib/endpointWrapper";
import { Readability } from "@mozilla/readability";
import { PrismaClient } from "@prisma/client";
import { JSDOM } from "jsdom";
import {
  resourcesCreateRequestSchema,
  resourcesCreateResponseSchema,
} from "youwise-shared/api";

export const POST = PrivateEndpointWrapper(
  resourcesCreateRequestSchema,
  resourcesCreateResponseSchema,
  async ({ body, userId }) => {
    const url = body.url;
    const page = await fetch(url);
    const pageContent = await page.text();
    const dom = new JSDOM(pageContent, { url });
    const reader = new Readability(dom.window.document);

    const article = reader.parse();
    if (!article) {
      console.log("Failed to parse article");
      return {};
    }

    const prisma = new PrismaClient();

    const resource = await prisma.resource.create({
      data: {
        name: article.title,
        originalUrl: url,
        content: article.content,
        ownerUserId: userId,
      },
    });

    const textContent = article.textContent;

    const basicQuestions = await GPTExtractQuestions(userId, textContent);

    console.log(
      "\n\n\nBASIC QUESTIONS:\n\n\n",
      JSON.stringify(basicQuestions, null, 2)
    );

    const cards = await GPTGenerateFlashcards(userId, basicQuestions);

    console.log("\n\n\nCARDS:\n\n\n", JSON.stringify(cards, null, 2));

    await prisma.card.createMany({
      data: cards.map((card) => ({
        ...card,
        ownerUserId: userId,
        resourceId: resource.id,
      })),
    });

    return {};
  }
);
