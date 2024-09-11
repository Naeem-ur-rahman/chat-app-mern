import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { createChannel } from "../controllers/channel.js";

const router = Router()

router.post("/create-channel", verifyToken, createChannel)

export default router;