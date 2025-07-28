import express from 'express';
import { authenticateToken } from '../authMiddleware.js';
import { PrismaClient } from '@prisma/client';
import { recommendForCategory } from '../../utils/recommendationCategory.js';
import { mergePreferences } from '../../../shared/mergePreferences.mjs';

const prisma = new PrismaClient();

export default function createRecommendationRouter(category, responseKey) {
  const router = express.Router();

  router.post('/', authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    try {
      // Load the user’s preferences
      const userPreferences = await prisma.userPreference.findUnique({
        where: { userId },
      });
      if (!userPreferences) {
        return res.status(404).json({ message: 'User preferences not found' });
      }

      const effectiveCity = req.body.cityForRecommendation ?? userPreferences.defaultCity;
      const preferenceWithCity = {
        ...userPreferences,
        defaultCity: effectiveCity,
      };
      // Merge db preferences with client-sent weights
      const mergedPreferences = mergePreferences(preferenceWithCity, req.body.weights);

      const recommendations = await recommendForCategory(category, mergedPreferences);

      return res.status(200).json({ [responseKey]: recommendations });
    } catch (err) {
      // Dynamically capitalize category for log (e.g., "Restaurant recommendation error")
      const logPrefix = category.charAt(0).toUpperCase() + category.slice(1);
      console.error(`${logPrefix} recommendation error`, err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });

  return router;
}
