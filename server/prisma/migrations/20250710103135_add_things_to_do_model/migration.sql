-- CreateTable
CREATE TABLE "ThingsToDo" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "rating" DOUBLE PRECISION,
    "image_url" TEXT,
    "review_count" INTEGER,
    "description" TEXT,
    "location" TEXT,
    "category" TEXT,

    CONSTRAINT "ThingsToDo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ThingsToDo_city_idx" ON "ThingsToDo"("city");

-- CreateIndex
CREATE INDEX "ThingsToDo_state_idx" ON "ThingsToDo"("state");

-- CreateIndex
CREATE INDEX "ThingsToDo_rating_idx" ON "ThingsToDo"("rating");

-- CreateIndex
CREATE UNIQUE INDEX "ThingsToDo_name_city_state_key" ON "ThingsToDo"("name", "city", "state");
