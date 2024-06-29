/*
  Warnings:

  - You are about to drop the column `modelUsed` on the `ai_usages` table. All the data in the column will be lost.
  - Added the required column `model` to the `ai_usages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ai_usages" DROP COLUMN "modelUsed",
ADD COLUMN     "model" TEXT NOT NULL;
