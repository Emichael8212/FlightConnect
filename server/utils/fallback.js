import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// fallback function
// if the user's query is not in the database, return a list of items from the same city as the user's query
export async function getFallbackItems(city, excludeCategory, neededCount) {
    const categoriesToFetch = ['hotel', 'restaurant', 'thingsToDo'].filter(category => category !== excludeCategory);
    // fetch items from each category
    const results = await Promise.all(categoriesToFetch.map(async category => {
        // if the category is hotel, fetch hotels from the same city, as well as restaurants and things to do from the same city
        if (category === 'hotel') {
            return prisma.hotel.findMany({ where: { city: { equals: city, mode: 'insensitive' } }, take: 50 });
        } else if (category === 'restaurant') {
            return prisma.restaurant.findMany({ where: { city: { equals: city, mode: 'insensitive' } }, take: 50 });
        } else if (category === 'thingsToDo') {
            return prisma.thingsToDo.findMany({ where: { city: { equals: city, mode: 'insensitive' } }, take: 50 });
        }
        return [];
    }));

    // Flatten the array of arrays
    const allItems = results.flat();

    // sort the fallback items by rating first, then by review count
    allItems.sort((a, b) => {
        // then sort by rating
        if ((b.rating || 0) !== (a.rating || 0)) {
            return (b.rating || 0) - (a.rating || 0);
        }
        // in case of a tie, sort by review count
        return (b.reviewCount || 0) - (a.reviewCount || 0);
    });

    // return the first neededCount items
    return allItems.slice(0, neededCount).map(item => ({
        ...item,
        isFallback: true,
        originalCategory: excludeCategory,
    }));
}
