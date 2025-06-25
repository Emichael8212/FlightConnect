import express from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import { PrismaClient } from '@prisma/client'
import { authenticateToken } from "./authMiddleware.js";

const router = express.Router()
const prisma = new PrismaClient() 


router.post("/register", async(req, res) => {
    try {
        const {username, email, password, confirmPassword } = req.body
        console.log("Received body", req.body)

        if (!username || !password || !email || !confirmPassword) {
            return res.status(400).json({error: "Fill all fields"})
        }

        if (password.length < 8) {
            return res.status(400).json({error: "Password must be at least 8 characters long."})
        }

        if (password !== confirmPassword) {
            return res.status(400).json({error: "Passwords do not match"})
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
            user: { 
                id: newUser.id, 
                username: newUser.username, 
                email: newUser.email}});
    }   catch   (error) {
        console.error(error)
        res.status(500).json({error: "Something went wrong during signup"})
    }
})

// Login authentication:
router.post("/login", async(req, res) => {
    // get the username and password from the login form
    const {username, password} = req.body
    try {   
            // check if user provides the username and password
            if (!username || !password) {
                res.status(400).json({error: "Username and Password Required"})
            }
            // look up user by their username
            const user = await prisma.user.findUnique({
                where: {username}
            });
            if (!user) {
                res.status(400).json({error: "Invalid Username or Password Required"})
            }
            // compared user provided password with one in my database
            const isValidPassword = await bcrypt.compare(password, user.password);

            if (!isValidPassword) {
                res.status(400).json({error: "Incorrect Username or Password"})
            }

            const token = jwt.sign({
                userId: user.id, username: user.username},
                process.env.JWT_SECRET_KEY,
                {expiresIn: process.env.JWT_EXPIRES}
            )

            res.cookie("token", token, {
                httpOnly: true,
                sameSite: "strict",
                secure: process.env.NODE_ENV === "production",
                maxAge: 3*60*60*1000
            })

            res.status(200).json({message: "Login Successful"})
    } catch (error) {
        console.error(error)
    }
})

export default router

