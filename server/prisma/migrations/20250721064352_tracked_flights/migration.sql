/*
  Warnings:

  - You are about to drop the column `flightId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the `Flight` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_flightId_fkey";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "flightId";

-- DropTable
DROP TABLE "Flight";

-- CreateTable
CREATE TABLE "TrackedFlight" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "airline" TEXT NOT NULL,
    "planeNumber" TEXT NOT NULL,
    "depature" TEXT NOT NULL,
    "arrival" TEXT NOT NULL,
    "flightDate" TIMESTAMP(3),
    "trackedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrackedFlight_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TrackedFlight_userId_idx" ON "TrackedFlight"("userId");

-- AddForeignKey
ALTER TABLE "TrackedFlight" ADD CONSTRAINT "TrackedFlight_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
