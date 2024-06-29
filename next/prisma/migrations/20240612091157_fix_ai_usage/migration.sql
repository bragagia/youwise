/*
  Warnings:

  - You are about to drop the column `ownerUserId` on the `ai_usages` table. All the data in the column will be lost.
  - Added the required column `userId` to the `ai_usages` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ai_usages" DROP CONSTRAINT "ai_usages_ownerUserId_fkey";

-- AlterTable
ALTER TABLE "ai_usages" DROP COLUMN "ownerUserId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ai_usages" ADD CONSTRAINT "ai_usages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
