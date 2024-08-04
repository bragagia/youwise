/*
  Warnings:

  - You are about to drop the column `fsrs_stabilit` on the `MemoryParams` table. All the data in the column will be lost.
  - Added the required column `fsrs_stability` to the `MemoryParams` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MemoryParams" DROP COLUMN "fsrs_stabilit",
ADD COLUMN     "fsrs_stability" DOUBLE PRECISION NOT NULL;
