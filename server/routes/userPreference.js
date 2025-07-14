import express from 'express';
import { authenticateToken } from '../routes/authMiddleware.js';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();
const router = express.Router();



router.get('/', authenticateToken, async (req, res) => {
    const userId = req.user.userId
  try {
    const userPref = await prisma.userPreference.findUnique({
      where: { userId },
    });
    res.json(userPref || {});
  } catch (error) {
    console.error('Pref Get error', error);
    res.status(500).json({ error: "Failed to Load preference" });
  }
});


router.post('/', authenticateToken, async (req, res) => {
  const { budgetTier, cuisine, activityCategory, defaultCity } = req.body;
  try {
    const userPref = await prisma.userPreference.upsert({
      where: { userId: req.user.userId },
      create: {
        userId: req.user.userId,
        budgetTier,
        cuisine,
        activityCategory,
        defaultCity,
      },
      update: {
        budgetTier,
        cuisine,
        activityCategory,
        defaultCity,
      },
    });
    res.json(userPref);
  } catch (error) {
    console.error("pref POST error", error);
    res.status(500).json({ error: "Failed to update preference" });
  }
});

export default router;
