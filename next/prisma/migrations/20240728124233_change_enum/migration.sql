/*
  Warnings:

  - The values [learning,reviewing,relearning] on the enum `MemoryStatusEnum` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MemoryStatusEnum_new" AS ENUM ('new', 'review', 'forgotten');
ALTER TABLE "memories" ALTER COLUMN "memoryStatus" TYPE "MemoryStatusEnum_new" USING ("memoryStatus"::text::"MemoryStatusEnum_new");
ALTER TYPE "MemoryStatusEnum" RENAME TO "MemoryStatusEnum_old";
ALTER TYPE "MemoryStatusEnum_new" RENAME TO "MemoryStatusEnum";
DROP TYPE "MemoryStatusEnum_old";
COMMIT;
