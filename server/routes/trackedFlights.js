import express from 'express';
import { authenticateToken } from '../routes/authMiddleware.js';
import { prisma } from '../../server/utils/prisma.js';

const router = express.Router();

// GET all tracked flights for a user
router.get('/', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  try {
    const trackedFlights = await prisma.trackedFlight.findMany({
      where: { userId },
      orderBy: { trackedAt: 'desc' },
    });
    res.json(trackedFlights);
  } catch (err) {
    console.error('Get tracked flights error', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST a new tracked flight (save)
router.post('/', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const { airline, flightNumber, departure, arrival, flightDate } = req.body;  // Consistent naming

  try {
    if (!flightNumber || !departure || !arrival) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check for duplicate by flightNumber (unique per user)
    const existing = await prisma.trackedFlight.findFirst({
      where: { userId, flightNumber },
    });
    if (existing) {
      return res.status(400).json({ message: 'Flight already tracked' });
    }

    const saved = await prisma.trackedFlight.create({
      data: {
        userId,
        airline: airline || '',
        flightNumber,
        departure,
        arrival,
        flightDate: flightDate ? new Date(flightDate) : null,
      },
    });
    res.json(saved);
  } catch (err) {
    console.error('Save flight error', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE a tracked flight (unsave)
router.delete('/:id', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const id = Number(req.params.id);

  try {
    const deleted = await prisma.trackedFlight.deleteMany({
      where: { id, userId },
    });
    if (deleted.count === 0) {
      return res.status(404).json({ message: 'Flight not found or not yours' });
    }
    res.json({ message: 'Flight unsaved' });
  } catch (err) {
    console.error('Unsave flight error', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});



export default router;
