import express from 'express';
import { authenticateToken } from '../routes/authMiddleware.js';
import { PrismaClient } from '@prisma/client';

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
    return res.status(500).json({ error: "Failed to Load preference" });
  }
});

// post a new preference for a new user on registration
router.post('/', authenticateToken, async (req, res) => {
  const { budgetTier, cuisine, activityCategory, defaultCity } = req.body;
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
      },
      // if there's a preference for the user, I'll update it
      update: {
        budgetTier,
        cuisine,
        activityCategory,
        defaultCity,
      },
    });
    // return the updated preference
    res.json(userPref);
  } catch (error) {
    console.error("pref POST error", error);
    return res.status(500).json({ error: "Failed to update preference" });
  }
});

router.get('/exists', authenticateToken, async (req, res) => {

  const prefCity = (req.query.defaultCity || '').trim();
  if (!prefCity) {
    return res.status(400).json({ error: "City required" });
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
    console.error("error Getting City", error);
    res.status(500).json({ error: "Failed to verify City" });
  }
});

export default router;
