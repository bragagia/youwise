import { PrivateEndpointWrapper } from "@/lib/endpointWrapper";
import { memoryWrapper } from "@/lib/objectsWrapper";
import { DayjsDate } from "@/lib/PlainDate";
import { PrismaClient } from "@prisma/client";
import { shuffleArray } from "youwise-shared";
import {
  CardVariant,
  DailyRevisionsGenerateResponse,
  dailyRevisionsGenerateRequestSchema,
  dailyRevisionsGenerateResponseSchema,
} from "youwise-shared/api";

export const POST = PrivateEndpointWrapper(
  dailyRevisionsGenerateRequestSchema,
  dailyRevisionsGenerateResponseSchema,
  async ({ body, userId }) => {
    const prisma = new PrismaClient();

    const date = new DayjsDate(body.date).addDays(3); // ? We add three days so that we total 4 days of review that we will average

    const memoriesToReviseInNextDays = await prisma.memory.findMany({
      where: {
        ownerUserId: userId,
        memoryParams: {
          AND: [
            {
              dueEasy: {
                lte: date.toDate(),
              },
              fsrs_state: "Review", // Todo: Handle other states
            },
            {
              // We prevent the memory from being reviewed if it was already learned or reviewed today
              OR: [
                {
                  fsrs_last_review: {
                    not: null,
                    gt: date.toDate(),
                  },
                },
                { fsrs_last_review: null },
                {
                  // If the state is learning or relearning, we allow it to be reviewed again today
                  fsrs_state: {
                    in: ["Learning", "Relearning"],
                  },
                },
              ],
            },
          ],
        },
      },
      include: {
        memoryParams: true,
        card: {
          include: {
            resource: {
              select: {
                id: true,
                name: true,
                tint: true,
              },
            },
          },
        },
      },
    });

    // Todo: Handle overdue memories separately so that they are reviewed first always

    const shuffled = shuffleArray(memoriesToReviseInNextDays);
    const memoriesNumberToRevise = Math.min(4, Math.ceil(shuffled.length / 4));

    const memoriesToRevise = shuffled.slice(0, memoriesNumberToRevise);

    const res: DailyRevisionsGenerateResponse = {
      date: date.toString(),
      cards: memoriesToRevise.map((memory) => ({
        ...memory.card,
        variants: memory.card.variants as CardVariant[],
        memory: memoryWrapper(memory),
        resourceHeader: memory.card.resource,
      })),
    };

    return res;
  }
);
