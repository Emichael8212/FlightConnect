import { normalize } from './normalize.js';

// map the budget tier of the user preference to a range of min and max prices
export const budgetTierToPriceRange = {
    1: { min: 0, max: 50 },
    2: { min: 50, max: 100 },
    3: { min: 100, max: 200 },
    4: { min: 200, max: Infinity },
};

// Calculate sub-score based on category-specific weights
export function calculateCategorySubScore(item, userPreferences, categoryType) {
    // initiate a variable to store the score for the item's rating and review count
  let subScore = 0;

  if (categoryType === 'hotel') {
    // I'll destructure weights from user preferences for hotels and provide default values
    const { hotelPriceWeight = 0.4, hotelRatingWeight = 0.3, hotelReviewWeight = 0.3 } = userPreferences;
    // Price closeness: distance from budget midpoint (higher closeness = better)
    const budgetPriceMin = budgetTierToPriceRange[userPreferences.budgetTier].min;
    const budgetPriceMax = Number.isFinite(budgetTierToPriceRange[userPreferences.budgetTier].max)
        ? budgetTierToPriceRange[userPreferences.budgetTier].max : 1000;

    const budgetPriceMidpoint = (budgetPriceMin + budgetPriceMax) / 2;

    // calculate the distance between the item price and the budget midpoint for the price closeness score
    const priceDiff = Math.abs(item.price - budgetPriceMidpoint);

    // calculate the maximum difference possible from midpoint to min or max budget price
    const maxPriceDiff = Math.max(budgetPriceMidpoint - budgetPriceMin, budgetPriceMax - budgetPriceMidpoint);

    // calculate the price closeness score
    const priceClosenessScore = 1 - (priceDiff / maxPriceDiff); // 0 to 1, where 1 is exact match

    subScore += hotelPriceWeight * normalize(priceClosenessScore, 0, 1);
    subScore += hotelRatingWeight * normalize(item.rating || 0, 0, 5);
    subScore += hotelReviewWeight * normalize(item.reviewCount || 0, 0, 1000);

  } else if (categoryType === 'restaurant') {
    const { restaurantRatingWeight = 0.5, restaurantReviewWeight = 0.5 } = userPreferences;
    subScore += restaurantRatingWeight * normalize(item.rating || 0, 0, 5);
    subScore += restaurantReviewWeight * normalize(item.reviewCount || 0, 0, 1000);

  } else if (categoryType === 'thingsToDo') {
    const { thingsToDoRatingWeight = 0.5, thingsToDoReviewWeight = 0.5 } = userPreferences;
    subScore += thingsToDoRatingWeight * normalize(item.rating || 0, 0, 5);
    subScore += thingsToDoReviewWeight * normalize(item.reviewCount || 0, 0, 1000);
  }
  return subScore;
}

// Calculate overall score: preference matches + sub-scores
export function calculateOverallScore(item, userPreferences, categoryType) {
  let score = 0;
  // destructure weights from user preferences for hotels and provide default values
  const { cityWeight = 0.4, budgetWeight = 0.3, cuisineWeight = 0.15, activityWeight = 0.15 } = userPreferences;

  // Calculate normalized weights based on applicable weights
  let applicableTotal = cityWeight; // City always applies
  let normalizedCityWeight = cityWeight;

  // for hotels, first look at budget match,
  if (categoryType === 'hotel') {
    applicableTotal += budgetWeight;
    const normalizationFactor = applicableTotal > 0 ? 1 / applicableTotal : 1;
    normalizedCityWeight *= normalizationFactor;
    const normalizedBudgetWeight = budgetWeight * normalizationFactor;
    // City match
    score += normalizedCityWeight * 1;

    // Budget match
    const userBudgetRange = budgetTierToPriceRange[userPreferences.budgetTier];
    if (item.price >= userBudgetRange.min && (!Number.isFinite(userBudgetRange.max) || item.price <= userBudgetRange.max)) {
      score += normalizedBudgetWeight * 1;
    }

  } else if (categoryType === 'restaurant') {
    applicableTotal += cuisineWeight;
    const normalizationFactor = applicableTotal > 0 ? 1 / applicableTotal : 1;
    normalizedCityWeight *= normalizationFactor;
    const normalizedCuisineWeight = cuisineWeight * normalizationFactor;
    // City match
    score += normalizedCityWeight * 1;

    // Add cuisine match score if item category matches user's cuisine preference
    if (userPreferences.cuisine && item.category?.toLowerCase().includes(userPreferences.cuisine.toLowerCase())) {
      score += normalizedCuisineWeight * 1;
    }

  } else if (categoryType === 'thingsToDo') {
    applicableTotal += activityWeight;
    const normalizationFactor = applicableTotal > 0 ? 1 / applicableTotal : 1;
    normalizedCityWeight *= normalizationFactor;
    const normalizedActivityWeight = activityWeight * normalizationFactor;
    // City match
    score += normalizedCityWeight * 1;

    // Add activity match score if item category matches user's activity preference
    if (userPreferences.activityCategory && item.category?.toLowerCase().includes(userPreferences.activityCategory.toLowerCase())) {
      score += normalizedActivityWeight * 1;
    }
  }
  // Add sub-scores for finer ranking
  score += calculateCategorySubScore(item, userPreferences, categoryType);
  return score;
}
