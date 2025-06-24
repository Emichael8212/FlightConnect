// import express, { Router } from "express";
// import { PrismaClient } from "@prisma/client";

// const router = express.Router();
// const prisma = new PrismaClient();

// // // GET /posts
// router.get("/users", async (req, res) => {
//     try {
//         const users = await prisma.findMany();
//         res.json(users);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Failed to fetch posts" });
//     }
// });

// // // POST /posts
// router.post("/", async (req, res) => {
//     const { title, content } = req.body;
//     try {
//         const newPost = await prisma.post.create({
//         data: { title, content },
//         });
//         res.status(201).json(newPost);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Failed to create post" });
//     }
//     });

export default router;