/*
  Warnings:

  - You are about to drop the column `days` on the `FiftyTime` table. All the data in the column will be lost.
  - You are about to drop the column `hours` on the `FiftyTime` table. All the data in the column will be lost.
  - You are about to drop the column `minutes` on the `FiftyTime` table. All the data in the column will be lost.
  - You are about to drop the column `seconds` on the `FiftyTime` table. All the data in the column will be lost.
  - Added the required column `endDate` to the `FiftyTime` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `FiftyTime` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FiftyTime" DROP COLUMN "days",
DROP COLUMN "hours",
DROP COLUMN "minutes",
DROP COLUMN "seconds",
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL;
