import express from 'express';
import { authenticateToken } from '../routes/authMiddleware.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// map the budget tier of the user preference to a range of prices
const budgetMap = {
    1: { min: 0, max: 50 },
    2: { min: 50, max: 100 },
    3: { min: 100, max: 200 },
    4: { min: 200, max: Infinity },
};
// normalize the city name to lowercase and trim whitespace
function normalizeCity(city) {
    return city?.trim().toLocaleLowerCase() || null;
}
// intialize a helper function to recommend items with a fallback
async function recommendWithFallBack(model, firstWhere, secondWhere = null, options= {}) {
    let results = await model.findMany({
        where: firstWhere, ...options });
    if (results.length > 0) {
        return results;
    }
    if (secondWhere) {
        results = await model.findMany({
            where: secondWhere, ...options
        });
        if (results.length > 0) {
            return results;
        }}
    return await model.findMany(options);
}
// POST the recommendation based on the user's preferences
router.post('/', authenticateToken, async (req, res) => {
    const userId = req.user.userId;

    try {
        // match the user's preferences based on the user id
        const pref = await prisma.userPreference.findUnique({
            where: {userId}
        });
        if (!pref) {
            return res.status(400).json({ message: 'User preferences not found' });
        }
        // destructure the user's preferences
        const {defaultCity, budgetTier, cuisine, activityCategory} = pref;
        // normalize the city name to lowercase and trim whitespace
        const city = normalizeCity(defaultCity);
        if (!city) {
            return res.status(400).json({ message: 'Invalid city' });
        }
        // match the budget tier to a range of prices
        const tier = budgetMap[budgetTier];
        if (!tier) {
            return res.status(400).json({ message: 'Invalid budget tier' });
        }
        // filter the price using prisma's filter
        const priceFilter = { gte: tier.min };
        if (Number.isFinite(tier.max)) {
            priceFilter.lte = tier.max;
        }
        // filter the city with case insensitive
        const cityFilter = { equals: city, mode: 'insensitive' };
        const findOptions = { orderBy: { rating: 'desc' }, take: 10 };
        // filter the hotels based  on city and price
        const hotelWhere = {
            city: cityFilter,
            price: priceFilter,
        };
        // filter the restaurants based on city, cuisine
        const restaurantWhere = {
            city: cityFilter,
            ...(cuisine && {
                category: {contains: cuisine, mode: 'insensitive'},
            }),
        };
        // filter the things to do based on city and activity category
        const thingsToDoWhere = {
            city: cityFilter,
            ...(activityCategory && {
                category: {contains: activityCategory, mode: 'insensitive'},
            }),
        };
        // create a helper function to generate a filter for the city
        function cityFallBackFilter(cityFilter) {
            return {city: cityFilter};
        }
        // define fallback filters for all the models based on the city
        const hotelFallback = cityFallBackFilter(cityFilter);
        const restaurantFallback = cityFallBackFilter(cityFilter);
        const thingsToDoFallback = cityFallBackFilter(cityFilter);

        // call the helper function to recommend items with a fallback
        const hotels = await recommendWithFallBack(prisma.hotel, hotelWhere, hotelFallback, findOptions);
        const restaurants = await recommendWithFallBack(prisma.restaurant, restaurantWhere, restaurantFallback, findOptions);
        const thingsToDo = await recommendWithFallBack(prisma.thingsToDo, thingsToDoWhere, thingsToDoFallback, findOptions);

        return res.status(200).json({
            hotels, restaurants, thingsToDo
        });
    } catch (err) {
        console.error('Recommendation error', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
