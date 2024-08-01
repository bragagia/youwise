/*
  Warnings:

  - You are about to drop the column `easeFactor` on the `memories` table. All the data in the column will be lost.
  - You are about to drop the column `interval` on the `memories` table. All the data in the column will be lost.
  - You are about to drop the column `stepNumber` on the `memories` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "memories" DROP COLUMN "easeFactor",
DROP COLUMN "interval",
DROP COLUMN "stepNumber";
