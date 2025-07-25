import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from './authMiddleware.js';
import emailValidator from 'email-validator';

const router = express.Router();
const prisma = new PrismaClient();

function sendErrorMessage(res, status, message) {
  return res.status(status).json({ error: message });
}

router.post('/register', async (req, res) => {
  try {
    let { username, email, password, confirmPassword } = req.body;
    username = username?.trim().toLowerCase() || '';
    email    = email?.toLowerCase()    || '';

    // validation in switch(true)
    switch (true) {
      case !username || !email || !password || !confirmPassword:
        return sendErrorMessage(res, 400, 'Fill all fields');
      case !emailValidator.validate(email):
        return sendErrorMessage(res, 400, 'Invalid email address');
      case password.length < 8:
        return sendErrorMessage(res, 400, 'Password must be at least 8 characters long');
      case password !== confirmPassword:
        return sendErrorMessage(res, 400, 'Passwords do not match');
      case username === password:
        return sendErrorMessage(res, 400, 'Username and password cannot be the same');
      default:
        break;
    }

    const existingUser = await prisma.user.findUnique({
        where: {username}
    });
    if (existingUser) {
        return sendErrorMessage(res, 400, 'Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
        data: {
            username,
            email,
            password: hashedPassword,
        },
    });
    res.status(201).json({message: 'Signup successful!',
        user: {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email}});
}   catch   (error) {
    console.error(error);
    req.status(500).json({error: 'Something went wrong'});
}
});

// Login authentication:
router.post('/login', async(req, res) => {
    // get the username and password from the login form
    try {
    let { username, password } = req.body;
    username = username?.toLowerCase() || '';

    // validation in switch(true)
    switch (true) {
      case !username || !password:
        return sendErrorMessage(res, 400, 'Username and password required');
      default:
        break;
    }
        // look up user by their username
        const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return sendErrorMessage(res, 400, 'Invalid username or password');
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return sendErrorMessage(res, 400, 'Invalid username or password');
    }

        const token = jwt.sign({
            userId: user.id, username: user.username},
            process.env.JWT_SECRET_KEY,
            {expiresIn: process.env.JWT_EXPIRES}
        );
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3*60*60*1000
        });

            return res.status(200).json({error: 'Login Successful'});
    }   catch (error) {
        console.error(error);
        return sendErrorMessage(res, 500, 'Something went wrong');
    }
});


router.get('/profile', authenticateToken, async (req, res) => {
    const {userId, username} = req.user;
    res.json({userId, username});
});

router.post('/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
    });
    return res.json({message: 'Logout Successful'});
});

export default router;
