import express from "express"
import bcrypt from "bcrypt"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient() 
const router = express.Router()

router.post("/register", async(req, res) => {
    try {
        const {username, email, password } = req.body
        console.log("Received body", req.body)

        if (!username || !password) {
            return res.status(400).json({error: "Username is required"})
        }

        if (password.length < 8) {
            return res.status(400).json({error: "Password must be at least 8 characters long."})
        }

        const existingUser = await prisma.user.findUnique({
            where: {username}
        })

        if (existingUser) {
            return res.status(400).json({error: "Username already exists."})
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await prisma.user.create({
        
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });
        

        res.status(201).json({message: "Signup successful!", 
            user: { id: newUser.id, username: newUser.username, email: newUser.email}});
    }   catch   (error) {
        console.error(error)
        res.status(500).json({error: "Something went wrong during signup"})
    }
})

export default router

