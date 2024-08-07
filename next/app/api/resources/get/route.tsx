import { PrivateEndpointWrapper } from "@/lib/endpointWrapper";
import { memoryWrapper } from "@/lib/objectsWrapper";
import { PrismaClient } from "@prisma/client";
import {
  CardVariant,
  resourceGetRequestSchema,
  resourceGetResponseSchema,
} from "youwise-shared/api";

export const POST = PrivateEndpointWrapper(
  resourceGetRequestSchema,
  resourceGetResponseSchema,
  async ({ body, userId }) => {
    const prisma = new PrismaClient();
    const resource = await prisma.resource.findUniqueOrThrow({
      where: {
        id: body.id,
        ownerUserId: userId,
      },
      include: {
        cards: {
          include: {
            memories: {
              where: {
                ownerUserId: userId,
              },
              include: {
                memoryParams: true,
              },
            },
          },
        },
      },
    });

    return {
      ...resource,
      cards: resource.cards.map((card) => ({
        ...card,
        variants: card.variants as CardVariant[],
        memory: memoryWrapper(card.memories[0]),
      })),
    };
  }
);
