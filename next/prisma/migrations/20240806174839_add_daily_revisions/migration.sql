/*
  Warnings:

  - You are about to drop the `MemoryParams` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MemoryParams" DROP CONSTRAINT "MemoryParams_memoryId_fkey";

-- DropTable
DROP TABLE "MemoryParams";

-- CreateTable
CREATE TABLE "memory_params" (
    "memoryId" TEXT NOT NULL,
    "dueEasy" TIMESTAMP(3) NOT NULL,
    "dueNormal" TIMESTAMP(3) NOT NULL,
    "dueHard" TIMESTAMP(3) NOT NULL,
    "dueHarder" TIMESTAMP(3) NOT NULL,
    "fsrs_state" "FsrsStateEnum" NOT NULL,
    "fsrs_stability" DOUBLE PRECISION NOT NULL,
    "fsrs_difficulty" DOUBLE PRECISION NOT NULL,
    "fsrs_elapsed_days" INTEGER NOT NULL,
    "fsrs_scheduled_days" INTEGER NOT NULL,
    "fsrs_reps" INTEGER NOT NULL,
    "fsrs_lapses" INTEGER NOT NULL,
    "fsrs_last_review" TIMESTAMP(3),

    CONSTRAINT "memory_params_pkey" PRIMARY KEY ("memoryId")
);

-- CreateTable
CREATE TABLE "memories_on_daily_revisions" (
    "memoryId" TEXT NOT NULL,
    "dailyRevisionsId" TEXT NOT NULL,

    CONSTRAINT "memories_on_daily_revisions_pkey" PRIMARY KEY ("memoryId","dailyRevisionsId")
);

-- CreateTable
CREATE TABLE "daily_revisions" (
    "id" TEXT NOT NULL,
    "ownerUserId" TEXT NOT NULL,
    "date" DATE NOT NULL,

    CONSTRAINT "daily_revisions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "daily_revisions_ownerUserId_date_key" ON "daily_revisions"("ownerUserId", "date");

-- AddForeignKey
ALTER TABLE "memory_params" ADD CONSTRAINT "memory_params_memoryId_fkey" FOREIGN KEY ("memoryId") REFERENCES "memories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memories_on_daily_revisions" ADD CONSTRAINT "memories_on_daily_revisions_memoryId_fkey" FOREIGN KEY ("memoryId") REFERENCES "memories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memories_on_daily_revisions" ADD CONSTRAINT "memories_on_daily_revisions_dailyRevisionsId_fkey" FOREIGN KEY ("dailyRevisionsId") REFERENCES "daily_revisions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_revisions" ADD CONSTRAINT "daily_revisions_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
