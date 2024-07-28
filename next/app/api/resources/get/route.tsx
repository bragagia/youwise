import { validateRequestAccessToken } from "@/lib/jwt";
import { SuccessResponse } from "@/lib/responses";
import { PrismaClient } from "@prisma/client";
import {
  CardVariant,
  resourceGetRequestSchema,
  ResourceGetResponse,
  resourceGetResponseSchema,
} from "youwise-shared/api";

export async function POST(request: Request) {
  const { userId, tokenErrorResponse } = validateRequestAccessToken(request);
  if (tokenErrorResponse) return tokenErrorResponse;

  const body = resourceGetRequestSchema.parse(await request.json());

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

  const typedResource = {
    ...resource,
    cards: resource.cards.map((card) => ({
      ...card,
      variants: card.variants as CardVariant[],
    })),
  };

  return SuccessResponse<ResourceGetResponse>(
    resourceGetResponseSchema,
    typedResource
  );
}
