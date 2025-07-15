-- CreateTable
CREATE TABLE "Userpreference" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "budgetTier" INTEGER NOT NULL,
    "cuisine" TEXT,
    "activityCategory" TEXT,
    "defaultCity" TEXT,

    CONSTRAINT "Userpreference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Userpreference_userId_key" ON "Userpreference"("userId");

-- AddForeignKey
ALTER TABLE "Userpreference" ADD CONSTRAINT "Userpreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
