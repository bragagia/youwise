import { PrivateEndpointWrapper } from "@/lib/endpointWrapper";
import { memoryWrapper } from "@/lib/objectsWrapper";
import { PrismaClient } from "@prisma/client";
import {
  memoriesNewRequestSchema,
  MemoriesNewResponse,
  memoriesNewResponseSchema,
} from "youwise-shared/api";

export const POST = PrivateEndpointWrapper(
  memoriesNewRequestSchema,
  memoriesNewResponseSchema,
  async ({ body, userId }) => {
    const prisma = new PrismaClient();

    if (body.memories.length === 0) {
      throw new Error("No memories provided");
    }

    // Verify owner user id
    const ok = body.memories.every((memory) => memory.ownerUserId === userId);
    if (!ok) {
      throw new Error("Invalid owner user id");
    }

    let ret: MemoriesNewResponse = {
      memories: [],
    };
    for (let memory of body.memories) {
      const createdMemory = memoryWrapper(
        await prisma.memory.create({
          data: {
            ...memory,
            memoryParams: memory.memoryParams
              ? {
                  create: memory.memoryParams,
                }
              : undefined,
          },
          include: {
            memoryParams: true,
          },
        })
      );

      if (createdMemory) ret.memories.push(createdMemory);
    }

    return ret;
  }
);
