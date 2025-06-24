import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient() 
import express  from 'express';
import cors from "cors"

import authRouter from "./routes/auth.js"


const app = express();
const PORT = 3007;

app.use(express.json());
app.use(cors())


app.use("/auth", authRouter);


app.listen(PORT, () => { 
    console.log(`Server listening on port ${PORT}`);
}); 