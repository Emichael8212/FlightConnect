import express from 'express';
import { authenticateToken } from '../authMiddleware.js';
import { PrismaClient } from '@prisma/client';
import { calculateOverallScore } from '../../utils/recommendationHelpers.js';
import { getFallbackItems } from '../../utils/fallback.js';
import { normalizeCity } from '../../utils/normalize.js';

const prisma = new PrismaClient();
const router = express.Router();

// POST 10 restaurants recommendations for a given city based on user preferences
router.post('/', authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    const {weights} = req.body;
// fetch user preferences from database
    try {
        let userPreferences = await prisma.userPreference.findUnique({
            where: {userId},
        });
        if (!userPreferences) {
            return res.status(404).json({message: 'User preferences not found'});
        }
        // destructure defaultCity and cuisine from userPreferences
        const {defaultCity, cuisine } = userPreferences;
        const userCity = normalizeCity(defaultCity);
        if (!userCity) {
            return res.status(400).json({message: 'Invalid city'});
        }
        // create a filter object for the city and cuisine (if provided) and find restaurants in the database
        // that match the filter and sort them by rating in descending order
        const cityFilter = { equals: userCity, mode: 'insensitive' };
        const findOptions = {
            orderBy: { rating: 'desc' }, take: 100
        };
        const restaurants = await prisma.restaurant.findMany({
            where: {
                city: cityFilter,
                ...(cuisine && {category: {contains: cuisine, mode: 'insensitive'}})
            },  ...findOptions
        })

        const maxResultPerCategory = 10;
        // calculate the overall score for each restaurant based on user preferences
        const scoredRestaurants = restaurants.map(item => ({
            ...item,
            categoryType: "restaurant",
            score: calculateOverallScore(item, userPreferences, "restaurant")
        }));
        let sortedRestaurants = scoredRestaurants.sort((a, b) => b.score - a.score).slice(0, maxResultPerCategory);
        // if there are less than 10 results, fetch fallback items
        if (sortedRestaurants.length < maxResultPerCategory) {
            const fallbackItems = await getFallbackItems(userCity, "restaurant", maxResultPerCategory - sortedRestaurants.length);
            sortedRestaurants = [...sortedRestaurants, ...fallbackItems];
        }

        return res.status(200).json({restaurants: sortedRestaurants});
    } catch (error) {
        console.error("Restaurant error", error);
        return res.status(500).json({message: 'Internal server error'});
    }
});

export default router;
