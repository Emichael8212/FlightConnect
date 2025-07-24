import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const modelLookup = {
    'hotel': prisma.hotel,
    'restaurant': prisma.restaurant,
    'thingsToDo': prisma.thingsToDo,
};

function byRatingandReviewCount(a, b) {
    const ratingA = a.rating ?? 0;
    const ratingB = b.rating ?? 0;
    if (ratingB !== ratingA) {
    return ratingB - ratingA;
    }
    const reviewsA = a.reviewCount ?? 0;
    const reviewsB = b.reviewCount ?? 0;
    return reviewsB - reviewsA;
}
// fallback function
// if the user's query is not in the database, return a list of items from the same city as the user's query
export async function getFallbackItems(city, category, neededCount) {
  // Only fall back to the same type of item you were originally looking for
  const categoriesToFetch = [category];

  const results = await Promise.all(
    categoriesToFetch.map(cat =>
      modelLookup[cat].findMany({
        where: { city: { equals: city, mode: 'insensitive' } },
        take: 50,
      })
    )
  );

  const allItems = results.flat();
  allItems.sort(byRatingandReviewCount);

  return allItems
    .slice(0, neededCount)
    .map(item => ({
      ...item,
      isFallback: true,
      originalCategory: category,
    }));
}
