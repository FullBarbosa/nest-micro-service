/*
  Warnings:

  - You are about to drop the column `slug` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `students` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "students_slug_key";

-- AlterTable
ALTER TABLE "students" DROP COLUMN "slug",
DROP COLUMN "title";
