import { PrismaClient } from '@prisma/client';
import { normalizeCity } from './normalize.js';
import { calculateOverallScore, budgetTierToPriceRange } from './recommendationHelpers.js';
import { getFallbackItems } from './fallback.js';

const prisma = new PrismaClient();
const MAX_FETCH = 100;
const MAX_RECOMMEND = 10;

const categoryConfigs = {
  hotel: {
    model: prisma.hotel,
    getFilter: prefs => {
      const range = budgetTierToPriceRange[prefs.budgetTier];
      if (!range) {
        throw new Error('Invalid budget tier');
      }
      const priceCondition = { gte: range.min };
      if (Number.isFinite(range.max)) priceCondition.lte = range.max;
      return { price: priceCondition };
    },
  },
  restaurant: {
    model: prisma.restaurant,
    getFilter: prefs =>
      prefs.cuisine
        ? { category: { contains: prefs.cuisine, mode: 'insensitive' } }
        : {},
  },
  thingsToDo: {
    model: prisma.thingsToDo,
    getFilter: prefs =>
      prefs.activityCategory
        ? { category: { contains: prefs.activityCategory, mode: 'insensitive' } }
        : {},
  },
};

export async function recommendForCategory(categoryType, userPreferences) {
    try {

        const config = categoryConfigs[categoryType];
        if (!config) {
            console.error('Unknown category:', categoryType);
            throw new Error(`Unknown category: ${categoryType}`);
        }

        // normalize and validate city
        const normalizedCity = normalizeCity(userPreferences.defaultCity);
        if (!normalizedCity) {
            console.error('Invalid default city:', userPreferences.defaultCity);
            throw new Error('Invalid default city');
        }

        // build the where clause
        const cityClause = { city: { equals: normalizedCity, mode: 'insensitive' } };
        const extraClause = config.getFilter(userPreferences);
        const fetchOptions = {
            where: { ...cityClause, ...extraClause },
            orderBy: { rating: 'desc' },
            take: MAX_FETCH,
        };

        // 1) Fetch up to MAX_FETCH items
        const fetchedItems = await config.model.findMany(fetchOptions);

        // 2) Score + sort + take top MAX_RECOMMEND
        const scoredItems = fetchedItems.map(item => ({
            ...item,
            categoryType,
            score: calculateOverallScore(item, userPreferences, categoryType),
        }));
        scoredItems.sort((a, b) => b.score - a.score);
        let topRecommendations = scoredItems.slice(0, MAX_RECOMMEND);

        // 3) Fill with fallbacks if under MAX_RECOMMEND
        if (topRecommendations.length < MAX_RECOMMEND) {
            const needed = MAX_RECOMMEND - topRecommendations.length;
            const fallbackItems = await getFallbackItems(normalizedCity, categoryType, needed);
            topRecommendations = [...topRecommendations, ...fallbackItems];
        }

        return topRecommendations;
    }   catch (error) {
        console.error('Error recommending for category:', categoryType, error);
        return [];
    }
}
