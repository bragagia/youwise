import { PrivateEndpointWrapper } from "@/lib/endpointWrapper";
import { Prisma, PrismaClient } from "@prisma/client";
import {
  MemoriesUpdateRequest,
  MemoriesUpdateResponse,
  memoriesUpdateRequestSchema,
  memoriesUpdateResponseSchema,
} from "youwise-shared/api";

export const POST = PrivateEndpointWrapper<
  MemoriesUpdateRequest,
  MemoriesUpdateResponse
>(
  memoriesUpdateRequestSchema,
  memoriesUpdateResponseSchema,
  async ({ body, userId }) => {
    const prisma = new PrismaClient();

    if (body.memories.length === 0) {
      throw new Error("No memories provided");
    }

    for (let memory of body.memories) {
      const memoryParamsReq: Prisma.MemoryParamsUpdateManyWithoutMemoryNestedInput =
        memory.memoryParams
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
          MemoryParams: memoryParamsReq,
        },
      });
    }

    return {};
  }
);
