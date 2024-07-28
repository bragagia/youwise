/*
  Warnings:

  - You are about to drop the column `answer` on the `cards` table. All the data in the column will be lost.
  - You are about to drop the column `card` on the `cards` table. All the data in the column will be lost.
  - You are about to drop the column `highlightId` on the `cards` table. All the data in the column will be lost.
  - You are about to drop the `highlights` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `variants` to the `cards` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "cards" DROP CONSTRAINT "cards_highlightId_fkey";

-- DropForeignKey
ALTER TABLE "highlights" DROP CONSTRAINT "highlights_resourceId_fkey";

-- DropForeignKey
ALTER TABLE "highlights" DROP CONSTRAINT "highlights_userId_fkey";

-- DropIndex
DROP INDEX "cards_highlightId_key";

-- AlterTable
ALTER TABLE "cards" DROP COLUMN "answer",
DROP COLUMN "card",
DROP COLUMN "highlightId",
ADD COLUMN     "variants" JSONB NOT NULL;

-- DropTable
DROP TABLE "highlights";
