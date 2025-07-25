import { normalize } from './normalize.js';
import { DEFAULT_MAIN_WEIGHTS, DEFAULT_HOTEL_WEIGHTS, DEFAULT_RESTAURANT_WEIGHTS, DEFAULT_THINGS_TO_DO_WEIGHTS } from '../../shared/WeightsConstants.mjs';
// Map the budget tier of the user preference to a range of min and max prices
export const budgetTierToPriceRange = {
 1: { min: 0, max: 50 },
 2: { min: 50, max: 100 },
 3: { min: 100, max: 200 },
 4: { min: 200, max: Infinity },
};


// Default weights configuration for each category
const DEFAULT_WEIGHTS = {
 common: {
   cityWeight: DEFAULT_MAIN_WEIGHTS.cityWeight,
   budgetWeight: DEFAULT_MAIN_WEIGHTS.budgetWeight,
   cuisineWeight: DEFAULT_MAIN_WEIGHTS.cuisineWeight,
   activityWeight: DEFAULT_MAIN_WEIGHTS.activityWeight,
 },
 hotel: {
   hotelPriceWeight: DEFAULT_HOTEL_WEIGHTS.hotelPriceWeight,
   hotelRatingWeight: DEFAULT_HOTEL_WEIGHTS.hotelRatingWeight,
   hotelReviewWeight: DEFAULT_HOTEL_WEIGHTS.hotelReviewWeight,
 },
 restaurant: {
   restaurantRatingWeight: DEFAULT_RESTAURANT_WEIGHTS.restaurantRatingWeight,
   restaurantReviewWeight: DEFAULT_RESTAURANT_WEIGHTS.restaurantReviewWeight,
 },
 thingsToDo: {
   thingsToDoRatingWeight: DEFAULT_THINGS_TO_DO_WEIGHTS.thingsToDoRatingWeight,
   thingsToDoReviewWeight: DEFAULT_THINGS_TO_DO_WEIGHTS.thingsToDoReviewWeight,
 }
};

function calculateRatingAndReviewScore(item, ratingWeight, reviewWeight) {
  return (
    ratingWeight * normalize(item.rating || 0, 0, 5) +
    reviewWeight * normalize(item.reviewCount || 0, 0, 1000)
  );
}

// Category-specific scoring configurations
const CATEGORY_CONFIGS = {
 hotel: {
   primaryWeight: 'cityWeight',
   secondaryWeight: 'budgetWeight',
   matchCriteria: (item, prefs) => {
     const userBudgetRange = budgetTierToPriceRange[prefs.budgetTier];
     return item.price >= userBudgetRange.min &&
            (!Number.isFinite(userBudgetRange.max) || item.price <= userBudgetRange.max);
   },
   subScoreCalculator: (item, weights) => {
     const { hotelPriceWeight, hotelRatingWeight, hotelReviewWeight } = weights;

     // Calculate price closeness score
     const budgetPriceMin = budgetTierToPriceRange[weights.budgetTier].min;
     const budgetPriceMax = Number.isFinite(budgetTierToPriceRange[weights.budgetTier].max)
        ? budgetTierToPriceRange[weights.budgetTier].max : 1000;
     const budgetPriceMidpoint = (budgetPriceMin + budgetPriceMax) / 2;
     const priceDiff = Math.abs(item.price - budgetPriceMidpoint);
     const maxPriceDiff = Math.max(budgetPriceMidpoint - budgetPriceMin, budgetPriceMax - budgetPriceMidpoint);
     const priceClosenessScore = 1 - (priceDiff / maxPriceDiff);

     // Calculate rating and review score
    const ratingAndReviewScore = calculateRatingAndReviewScore(
        item, hotelRatingWeight, hotelReviewWeight
      );
      return hotelPriceWeight * normalize(priceClosenessScore, 0, 1) + ratingAndReviewScore;
    }
 },
 restaurant: {
   primaryWeight: 'cityWeight',
   secondaryWeight: 'cuisineWeight',
   matchCriteria: (item, prefs) =>
     prefs.cuisine && item.category?.toLowerCase().includes(prefs.cuisine.toLowerCase()),
   subScoreCalculator: (item, weights) => {
      return calculateRatingAndReviewScore(
        item, weights.restaurantRatingWeight, weights.restaurantReviewWeight
      );
    }

 },
  thingsToDo: {
    primaryWeight: 'cityWeight',
    secondaryWeight: 'activityWeight',
    matchCriteria: (item, prefs) =>
      prefs.activityCategory && item.category?.toLowerCase().includes(prefs.activityCategory.toLowerCase()),
    subScoreCalculator: (item, weights) => {
      return calculateRatingAndReviewScore(
        item, weights.thingsToDoRatingWeight, weights.thingsToDoReviewWeight
      );
    }
  }
};

// Helper function to normalize weights
function normalizeWeights(primaryWeight, secondaryWeight) {
 const applicableTotal = primaryWeight + secondaryWeight;
 const normalizationFactor = applicableTotal > 0 ? 1 / applicableTotal : 1;
 return {
   normalizedPrimaryWeight: primaryWeight * normalizationFactor,
   normalizedSecondaryWeight: secondaryWeight * normalizationFactor,
 };
}


// Get merged weights with defaults
function getMergedWeights(userPreferences, categoryType) {
 return {
   ...DEFAULT_WEIGHTS.common,
   ...DEFAULT_WEIGHTS[categoryType],
   ...userPreferences
 };
}


// Calculate sub-score based on category-specific weights
export function calculateCategorySubScore(item, userPreferences, categoryType) {
 const config = CATEGORY_CONFIGS[categoryType];
 if (!config) return 0;
  const mergedWeights = getMergedWeights(userPreferences, categoryType);
 return config.subScoreCalculator(item, mergedWeights);
}


// Calculate overall score: preference matches + sub-scores
export function calculateOverallScore(item, userPreferences, categoryType) {
 const config = CATEGORY_CONFIGS[categoryType];
 if (!config) return 0;
  const mergedWeights = getMergedWeights(userPreferences, categoryType);
  // Get primary and secondary weights
 const primaryWeight = mergedWeights[config.primaryWeight] || 0;
 const secondaryWeight = mergedWeights[config.secondaryWeight] || 0;
  // Normalize weights
 const { normalizedPrimaryWeight, normalizedSecondaryWeight } =
   normalizeWeights(primaryWeight, secondaryWeight);
  let score = 0;
  // Primary match (city) is always considered matched
 score += normalizedPrimaryWeight * 1;
  // Secondary match (budget/cuisine/activity) if criteria is met
 if (config.matchCriteria(item, mergedWeights)) {
   score += normalizedSecondaryWeight * 1;
 }
  // Add sub-scores for finer ranking
 score += calculateCategorySubScore(item, mergedWeights, categoryType);
  return score;
}
