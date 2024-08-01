import { PrivateEndpointWrapper } from "@/lib/endpointWrapper";
import { PrismaClient } from "@prisma/client";
import {
  MemoriesNewRequest,
  MemoriesNewResponse,
  memoriesNewRequestSchema,
  memoriesNewResponseSchema,
} from "youwise-shared/api";

export const POST = PrivateEndpointWrapper<
  MemoriesNewRequest,
  MemoriesNewResponse
>(
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

    const memories = await prisma.memory.createManyAndReturn({
      data: body.memories,
    });

    //return typedResource;
    return { memories: memories };
  }
);
