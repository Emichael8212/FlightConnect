import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import express  from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import authRouter from './routes/auth.js';
import flightRouter from './routes/flights.js';
import emailRouter from './routes/email.js';
import userPreferenceRouter from './routes/userPreference.js';
import hotelRouter from './routes/recommendationRouter/hotelsRouter.js';
import restaurantRouter from './routes/recommendationRouter/restaurantsRouter.js';
import thingsToDoRouter from './routes/recommendationRouter/thingsToDoRouter.js';
import trackedFlightsRouter from './routes/trackedFlights.js';

dotenv.config();

const app = express();
const PORT = 3007;

app.use(cookieParser());
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));


app.use('/auth', authRouter);
app.use('/api/flights', flightRouter);
app.use('/email', emailRouter);
app.use('/preference', userPreferenceRouter);
app.use('/hotels', hotelRouter);
app.use('/restaurants', restaurantRouter);
app.use('/things-to-do', thingsToDoRouter);
app.use('/tracked-flights', trackedFlightsRouter);


app.listen(PORT);
