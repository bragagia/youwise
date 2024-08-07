import { PrismaClient } from "@prisma/client";
import { Memory } from "youwise-shared/api";

export function memoryWrapper(
  memory: Awaited<
    ReturnType<
      typeof PrismaClient.prototype.memory.findUnique<{
        where: {
          id: string;
        };
        include: {
          memoryParams: true;
        };
      }>
    >
  >
): Memory | null {
  return (
    memory && {
      ...memory,
      memoryParams: memory.memoryParams && {
        ...memory.memoryParams,
        dueEasy: memory.memoryParams.dueEasy.toISOString(),
        dueNormal: memory.memoryParams.dueNormal.toISOString(),
        dueHard: memory.memoryParams.dueHard.toISOString(),
        dueHarder: memory.memoryParams.dueHarder.toISOString(),
        fsrs_last_review: memory.memoryParams.fsrs_last_review
          ? memory.memoryParams.fsrs_last_review.toISOString()
          : null,
      },
    }
  );
}
