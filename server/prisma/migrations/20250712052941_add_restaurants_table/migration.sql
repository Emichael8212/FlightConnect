-- CreateTable
CREATE TABLE "Restaurant" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "rating" DOUBLE PRECISION,
    "image_url" TEXT,
    "category" TEXT,
    "review_count" INTEGER,
    "description" TEXT,

    CONSTRAINT "Restaurant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Restaurant_city_idx" ON "Restaurant"("city");

-- CreateIndex
CREATE INDEX "Restaurant_state_idx" ON "Restaurant"("state");

-- CreateIndex
CREATE INDEX "Restaurant_rating_idx" ON "Restaurant"("rating");

-- CreateIndex
CREATE INDEX "Restaurant_category_idx" ON "Restaurant"("category");

-- CreateIndex
CREATE UNIQUE INDEX "Restaurant_name_city_state_key" ON "Restaurant"("name", "city", "state");
