import express from 'express';
import { authenticateToken } from '../authMiddleware.js';
import { PrismaClient } from '@prisma/client';
import { recommendForCategory } from '../../utils/recommendationCategory.js';
import { mergePreferences } from '../../../shared/mergePreferences.js';

const prisma = new PrismaClient();
const router = express.Router();

// POST 10 restaurants recommendations for a given city based on user preferences
router.post('/', authenticateToken, async (req, res) => {
    const userId = req.user.userId;
// fetch user preferences from database
    try {
    // load the user’s preferences
    const userPreferences = await prisma.userPreference.findUnique({
      where: { userId },
    });
    if (!userPreferences) {
      return res.status(404).json({ message: 'User preferences not found' });
    }
     // merge db preferences with client sent weights
    const mergedPreferences = mergePreferences(userPreferences, req.body.weights);
    const restaurants = await recommendForCategory('restaurant', mergedPreferences);
    return res.status(200).json({ restaurants });

  } catch (err) {
    console.error('Restaurant recommendation error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
