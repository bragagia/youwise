import { PrivateEndpointWrapper } from "@/lib/endpointWrapper";
import { PrismaClient } from "@prisma/client";
import {
  memoriesUpdateRequestSchema,
  memoriesUpdateResponseSchema,
} from "youwise-shared/api";

export const POST = PrivateEndpointWrapper(
  memoriesUpdateRequestSchema,
  memoriesUpdateResponseSchema,
  async ({ body, userId }) => {
    const prisma = new PrismaClient();

    if (body.memories.length === 0) {
      throw new Error("No memories provided");
    }

    for (let memory of body.memories) {
      const memoryParamsReq = memory.memoryParams
        ? {
            upsert: {
              where: {
                memoryId: memory.id,
              },
              create: memory.memoryParams,
              update: memory.memoryParams,
            },
          }
        : {
            delete: {
              memoryId: memory.id,
            },
          };

      await prisma.memory.update({
        where: {
          id: memory.id,
          ownerUserId: userId,
        },
        data: {
          memoryParams: memoryParamsReq,
        },
      });
    }

    return {};
  }
);
