import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();
import express  from 'express';
import cors from "cors";
import cookieParser from 'cookie-parser';
import dotenv from "dotenv"

import authRouter from "./routes/auth.js"
import flightRouter from "./routes/flights.js"

dotenv.config();

const app = express();
const PORT = 3007;

app.use(cookieParser());
app.use(express.json());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));


app.use("/auth", authRouter);
app.use("/api/flights", flightRouter);

app.listen(PORT);
