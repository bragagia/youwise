import { GPTExtractQuestions } from "@/app/api/user/create/gptExtractBasicQuestions";
import { GPTGenerateFlashcards } from "@/app/api/user/create/gptGenerateFlashcards";
import { validateRequestAccessToken } from "@/lib/jwt";
import { SuccessResponse } from "@/lib/responses";
import { Readability } from "@mozilla/readability";
import { PrismaClient } from "@prisma/client";
import { JSDOM } from "jsdom";
import { VoidResponse, voidResponseSchema } from "youwise-shared/api";

export async function POST(request: Request) {
  const { userId, tokenErrorResponse } = validateRequestAccessToken(request);
  if (tokenErrorResponse !== undefined) return tokenErrorResponse;

  const url =
    "https://review.firstround.com/unexpected-anti-patterns-for-engineering-leaders-lessons-from-stripe-uber-carta/";
  const page = await fetch(url);
  const pageContent = await page.text();
  const dom = new JSDOM(pageContent, { url });
  const reader = new Readability(dom.window.document);

  const article = reader.parse();
  if (!article) {
    console.log("Failed to parse article");
    return SuccessResponse<VoidResponse>(voidResponseSchema, {});
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

  const textContent = article.content;

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

  return SuccessResponse<VoidResponse>(voidResponseSchema, {});
}
