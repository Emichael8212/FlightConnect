import express from 'express';
import { authenticateToken } from '../authMiddleware.js';
import { PrismaClient } from '@prisma/client';
import { calculateOverallScore } from '../../utils/recommendationHelpers.js';
import { getFallbackItems } from '../../utils/fallback.js';
import { normalizeCity } from '../../utils/normalize.js';

const prisma = new PrismaClient();
const router = express.Router();

// POST things-to-do recommendation route handler for a given city and activity category
router.post('/', authenticateToken, async (req, res) => {
    const userId = req.user.userId;

    try {
        // Get user preferences
        let userPreferences = await prisma.userPreference.findUnique({
            where: {userId},
        });
        if (!userPreferences) {
            return res.status(404).json({message: 'User preferences not found'});
        }
        // destructure user preferences for city and activity category
        const {defaultCity, activityCategory } = userPreferences;
        const userCity = normalizeCity(defaultCity);
        if (!userCity) {
            return res.status(400).json({message: 'Invalid city'});
        }
        // create filters for city and activity category
        const cityFilter = { equals: userCity, mode: 'insensitive' };
        const findOptions = {
            orderBy: { rating: 'desc' }, take: 100
        };
        // find things to do in the given city and activity category with the highest rating
        const thingsToDo = await prisma.thingsToDo.findMany({
            where: {
                city: cityFilter,
                ...(activityCategory && {category: {contains: activityCategory, mode: 'insensitive'}})
            },  ...findOptions
        });

        // recommend top 10 things to do in the given city and activity category based on user preferences
        const maxResultPerCategory = 10;
        const scoredThingsToDo = thingsToDo.map(item => ({
            ...item,
            categoryType: 'thingsToDo',
            score: calculateOverallScore(item, userPreferences, 'thingsToDo')
        }));
        let sortedThingsToDo = scoredThingsToDo.sort((a, b) => b.score - a.score).slice(0, maxResultPerCategory);
        // if less than 10 results, add fallback items
        if (sortedThingsToDo.length < maxResultPerCategory) {
            const fallbackItems = await getFallbackItems(userCity, 'thingsToDo', maxResultPerCategory - sortedThingsToDo.length);
            sortedThingsToDo = [...sortedThingsToDo, ...fallbackItems];
        }
        return res.status(200).json( {thingsToDo: sortedThingsToDo});
    }   catch (error) {
            console.error('ThingsToDo recommendation error', error);
        return res.status(500).json({message: 'Internal server error'});
    }
});

export default router;
