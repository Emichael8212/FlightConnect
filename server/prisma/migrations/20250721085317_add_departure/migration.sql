/*
  Warnings:

  - You are about to drop the column `depature` on the `TrackedFlight` table. All the data in the column will be lost.
  - Added the required column `departure` to the `TrackedFlight` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TrackedFlight" DROP COLUMN "depature",
ADD COLUMN     "departure" TEXT NOT NULL;
