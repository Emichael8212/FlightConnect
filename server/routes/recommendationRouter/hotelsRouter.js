import express from 'express';
import { authenticateToken } from '../authMiddleware.js';
import { PrismaClient } from '@prisma/client';
import { recommendForCategory } from '../../utils/recommendationCategory.js';

const prisma = new PrismaClient();
const router = express.Router();

// POST top 10 hotels recommendation for a user based on their preferences
router.post('/', authenticateToken, async (req, res) => {
    const userId = req.user.userId;

    try {
        // Get user preferences from database
        const userPreferences = await prisma.userPreference.findUnique({
      where: { userId },
    });
    if (!userPreferences) {
      return res.status(404).json({ message: 'User preferences not found' });
    }
    const hotels = await recommendForCategory('hotel', userPreferences);

    return res.status(200).json({ hotels });
  } catch (err) {
    console.error('Hotel recommendation error', err);
    return res
      .status(500)
      .json({ message: 'Internal server error' });
  }
});

export default router;
