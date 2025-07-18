import express from 'express';
import { authenticateToken } from '../authMiddleware.js';
import { PrismaClient } from '@prisma/client';
import { calculateOverallScore, budgetTierToPriceRange } from '../../utils/recommendationHelpers.js';
import { getFallbackItems } from '../../utils/fallback.js';
import { normalizeCity } from '../../utils/normalize.js';

const prisma = new PrismaClient();
const router = express.Router();

// POST top 10 hotels recommendation for a user based on their preferences
router.post('/', authenticateToken, async (req, res) => {
    const userId = req.user.userId;

    try {
        // Get user preferences from database
        let userPreferences = await prisma.userPreference.findUnique({
            where: {userId},
        });
        if (!userPreferences) {
            return res.status(404).json({message: 'User preferences not found'});
        }
        // destructure needed preferences
        const {defaultCity, budgetTier } = userPreferences;
        const userCity = normalizeCity(defaultCity);
        if (!userCity) {
            return res.status(400).json({message: 'Invalid city'});
        }
        // check if budget tier maps to a price range
        if (!budgetTierToPriceRange) {
            return res.status(400).json({message: 'Invalid budget tier'});
        }
        // create filters for city and price range
        const cityFilter = { equals: userCity, mode: 'insensitive' };
        const priceRangeFilter = { gte: budgetTierToPriceRange[budgetTier].min };
        if (Number.isFinite(budgetTierToPriceRange[budgetTier].max)) {
            priceRangeFilter.lte = budgetTierToPriceRange[budgetTier].max;
        }
        // initialize find options for query to get top 10 hotels by rating in descending order
        const findOptions = {
            orderBy: { rating: 'desc' }, take: 100
        };
        const hotels = await prisma.hotel.findMany({
            where: {
                city: cityFilter,
                price: priceRangeFilter
            },
            ...findOptions
        })

        const maxResultPerCategory = 10;
        const scoredHotels = hotels.map(item =>
            ({ ...item, categoryType: 'hotel', score: calculateOverallScore(item, userPreferences, 'hotel') }));

        // Sort hotels descending by score and take the top 10
        let sortedHotels = scoredHotels.sort((a, b) => b.score - a.score).slice(0, maxResultPerCategory);

        // If there are less than 10 hotels, fill the rest with fallback items
        if (sortedHotels.length < maxResultPerCategory) {
            const fallbackItems = await getFallbackItems('hotel', maxResultPerCategory - sortedHotels.length);
            sortedHotels = [...sortedHotels, ...fallbackItems];
        }

        return res.status(200).json({hotels: sortedHotels});
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: 'Internal server error'});
    }
});

export default router;
