/*
  Warnings:

  - You are about to drop the column `chapterNumber` on the `resources` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `resources` table. All the data in the column will be lost.
  - You are about to drop the column `fileId` on the `resources` table. All the data in the column will be lost.
  - You are about to drop the column `resourceType` on the `resources` table. All the data in the column will be lost.
  - Made the column `content` on table `resources` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "resources" DROP COLUMN "chapterNumber",
DROP COLUMN "description",
DROP COLUMN "fileId",
DROP COLUMN "resourceType",
ADD COLUMN     "tint" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "content" SET NOT NULL;
