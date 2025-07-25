/*
  Warnings:

  - You are about to drop the column `planeNumber` on the `TrackedFlight` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TrackedFlight" DROP COLUMN "planeNumber",
ADD COLUMN     "flightNumber" TEXT;
