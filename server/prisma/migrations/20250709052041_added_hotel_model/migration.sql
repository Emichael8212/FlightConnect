-- CreateTable
CREATE TABLE "Hotel" (
    "id" SERIAL NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rating" DOUBLE PRECISION,
    "image_url" TEXT,
    "review_count" INTEGER,
    "description" TEXT,
    "price" INTEGER NOT NULL,

    CONSTRAINT "Hotel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Hotel_city_idx" ON "Hotel"("city");

-- CreateIndex
CREATE INDEX "Hotel_state_idx" ON "Hotel"("state");

-- CreateIndex
CREATE INDEX "Hotel_rating_idx" ON "Hotel"("rating");
