import { validateRequestAccessToken } from "@/lib/jwt";
import { SuccessResponse } from "@/lib/responses";
import { PrismaClient } from "@prisma/client";
import {
  UserResourcesResponse,
  userResourcesResponseSchema,
} from "youwise-shared/api";

export async function POST(request: Request) {
  const { userId, tokenErrorResponse } = validateRequestAccessToken(request);
  if (tokenErrorResponse) return tokenErrorResponse;

  const prisma = new PrismaClient();
  const resources = await prisma.resource.findMany({
    where: {
      ownerUserId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return SuccessResponse<UserResourcesResponse>(userResourcesResponseSchema, {
    continue: [],
    saveForLater: [],
    library: resources.map((resource) => ({
      id: resource.id,
      ownerUserId: resource.ownerUserId,
      name: resource.name,
    })),
    explore: [],
  });
}
