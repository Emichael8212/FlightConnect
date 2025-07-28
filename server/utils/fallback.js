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
export async function getFallbackItems(city, excludeCategory, neededCount) {
    const categoriesToFetch = ['hotel', 'restaurant', 'thingsToDo'].filter(category => category !== excludeCategory);
    // fetch items from each category
        // if the category is hotel, fetch hotels from the same city, as well as restaurants and things to do from the same city
    const results = await Promise.all(
        categoriesToFetch.map(category =>
            modelLookup[category].findMany({
                where: { city: {equals: city, mode: 'insensitive' } },
                take: 50,
            })
        )
    );
    // Flatten the array of arrays
    const allItems = results.flat();

    // sort the fallback items by rating first, then by review count
    allItems.sort(byRatingandReviewCount);

    // return the first neededCount items
    return allItems.slice(0, neededCount).map(item => ({
        ...item,
        isFallback: true,
        originalCategory: excludeCategory,
    }));
}
