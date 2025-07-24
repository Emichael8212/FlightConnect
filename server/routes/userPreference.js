import express from 'express';
import { authenticateToken } from '../routes/authMiddleware.js';
import { PrismaClient } from '@prisma/client';
import {
  DEFAULT_MAIN_WEIGHTS,
  DEFAULT_HOTEL_WEIGHTS,
  DEFAULT_RESTAURANT_WEIGHTS,
  DEFAULT_THINGS_TO_DO_WEIGHTS,
} from '../../shared/WeightsConstants.mjs';

const prisma = new PrismaClient();
const router = express.Router();

// get current user saved preferences
router.get('/', authenticateToken, async (req, res) => {
  try {
    // check if there is a preference to a user id
    const userPref = await prisma.userPreference.findUnique({
      where: { userId: req.user.userId },
    });
    // if the user has no preference, return an empty object
    return res.json(userPref || {});
  } catch (error) {
    console.error('Pref Get error', error);
    return res.status(500).json({ error: 'Failed to Load preference' });
  }
});

// post a new preference for a new user on registration
router.post('/', authenticateToken, async (req, res) => {
  const {
    budgetTier,
    cuisine,
    activityCategory,
    defaultCity,

    cityWeight,
    budgetWeight,
    cuisineWeight,
    activityWeight,

    hotelPriceWeight,
    hotelRatingWeight,
    hotelReviewWeight,

    restaurantRatingWeight,
    restaurantReviewWeight,

    thingsToDoRatingWeight,
    thingsToDoReviewWeight,
   } = req.body;

  try {
    // if there's no perefence for the user, create a new one
    const userPref = await prisma.userPreference.upsert({
      where: { userId: req.user.userId },
      create: {
        userId: req.user.userId,
        budgetTier,
        cuisine,
        activityCategory,
        defaultCity,

        // set default weights if not provided
        cityWeight: cityWeight || DEFAULT_MAIN_WEIGHTS.cityWeight,
        budgetWeight: budgetWeight || DEFAULT_MAIN_WEIGHTS.budgetWeight,
        cuisineWeight: cuisineWeight || DEFAULT_MAIN_WEIGHTS.cuisineWeight,
        activityWeight: activityWeight || DEFAULT_MAIN_WEIGHTS.activityWeight,
        hotelPriceWeight: hotelPriceWeight || DEFAULT_HOTEL_WEIGHTS.priceWeight,
        hotelRatingWeight: hotelRatingWeight || DEFAULT_HOTEL_WEIGHTS.ratingWeight,
        hotelReviewWeight: hotelReviewWeight || DEFAULT_HOTEL_WEIGHTS.reviewWeight,
        restaurantRatingWeight: restaurantRatingWeight || DEFAULT_RESTAURANT_WEIGHTS.ratingWeight,
        restaurantReviewWeight: restaurantReviewWeight || DEFAULT_RESTAURANT_WEIGHTS.reviewWeight,
        thingsToDoRatingWeight: thingsToDoRatingWeight || DEFAULT_THINGS_TO_DO_WEIGHTS.ratingWeight,
        thingsToDoReviewWeight: thingsToDoReviewWeight || DEFAULT_THINGS_TO_DO_WEIGHTS.reviewWeight,
      },
      // if there's a preference for the user, I'll update it
      update: {
        budgetTier,
        cuisine,
        activityCategory,
        defaultCity,

        // update weights if provided
        cityWeight: cityWeight || undefined,
        budgetWeight: budgetWeight || undefined,
        cuisineWeight: cuisineWeight || undefined,
        activityWeight: activityWeight || undefined,
        hotelPriceWeight: hotelPriceWeight || undefined,
        hotelRatingWeight: hotelRatingWeight || undefined,
        hotelReviewWeight: hotelReviewWeight || undefined,
        restaurantRatingWeight: restaurantRatingWeight || undefined,
        restaurantReviewWeight: restaurantReviewWeight || undefined,
        thingsToDoRatingWeight: thingsToDoRatingWeight || undefined,
        thingsToDoReviewWeight: thingsToDoReviewWeight || undefined,
      },
    });
    // return the updated preference
    res.json(userPref);
  } catch (error) {
    console.error('pref POST error', error);
    return res.status(500).json({ error: 'Failed to update preference' });
  }
});

router.get('/exists', authenticateToken, async (req, res) => {

  const prefCity = (req.query.defaultCity || '').trim();
  if (!prefCity) {
    return res.status(400).json({ error: 'City required' });
  }
  const city = prefCity.toLowerCase();
  // check if the city exists in the database
  try {
    const [hotel, restaurant, activity] = await Promise.all([
      prisma.hotel.findFirst({
        where: { city: { equals: city, mode: 'insensitive' } },
      }),
    prisma.restaurant.findFirst({
      where: { city: { equals: city, mode: 'insensitive' } },
    }),
    prisma.thingsToDo.findFirst({
      where: { city: { equals: city, mode: 'insensitive' } },
    }),
  ]);
    // if the city exists, return true, otherwise false
    return res.json({ exists: Boolean(hotel || restaurant || activity) });
  } catch (error) {
    console.error('error Getting City', error);
    res.status(500).json({ error: 'Failed to verify City' });
  }
});

export default router;
