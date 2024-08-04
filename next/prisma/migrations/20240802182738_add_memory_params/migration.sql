/*
  Warnings:

  - You are about to drop the column `resourceId` on the `memories` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "memories" DROP CONSTRAINT "memories_resourceId_fkey";

-- AlterTable
ALTER TABLE "memories" DROP COLUMN "resourceId";
