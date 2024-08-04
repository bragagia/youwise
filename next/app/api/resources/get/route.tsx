import { PrivateEndpointWrapper } from "@/lib/endpointWrapper";
import { PrismaClient } from "@prisma/client";
import {
  CardVariant,
  ResourceGetRequest,
  resourceGetRequestSchema,
  ResourceGetResponse,
  resourceGetResponseSchema,
} from "youwise-shared/api";

export const POST = PrivateEndpointWrapper<
  ResourceGetRequest,
  ResourceGetResponse
>(
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
        memory: card.memories[0],
      })),
    };
  }
);
