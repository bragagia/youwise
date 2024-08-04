/*
  Warnings:

  - You are about to drop the column `memoryStatus` on the `memories` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ownerUserId,cardId]` on the table `memories` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "FsrsStateEnum" AS ENUM ('Learning', 'Review', 'Relearning');

-- AlterTable
ALTER TABLE "memories" DROP COLUMN "memoryStatus";

-- DropEnum
DROP TYPE "MemoryStatusEnum";

-- CreateTable
CREATE TABLE "MemoryParams" (
    "memoryId" TEXT NOT NULL,
    "dueEasy" TIMESTAMP(3) NOT NULL,
    "dueNormal" TIMESTAMP(3) NOT NULL,
    "dueHard" TIMESTAMP(3) NOT NULL,
    "dueHarder" TIMESTAMP(3) NOT NULL,
    "fsrs_state" "FsrsStateEnum" NOT NULL,
    "fsrs_stabilit" DOUBLE PRECISION NOT NULL,
    "fsrs_difficulty" DOUBLE PRECISION NOT NULL,
    "fsrs_elapsed_days" INTEGER NOT NULL,
    "fsrs_scheduled_days" INTEGER NOT NULL,
    "fsrs_reps" INTEGER NOT NULL,
    "fsrs_lapses" INTEGER NOT NULL,
    "fsrs_last_review" TIMESTAMP(3),

    CONSTRAINT "MemoryParams_pkey" PRIMARY KEY ("memoryId")
);

-- CreateIndex
CREATE UNIQUE INDEX "memories_ownerUserId_cardId_key" ON "memories"("ownerUserId", "cardId");

-- AddForeignKey
ALTER TABLE "MemoryParams" ADD CONSTRAINT "MemoryParams_memoryId_fkey" FOREIGN KEY ("memoryId") REFERENCES "memories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
