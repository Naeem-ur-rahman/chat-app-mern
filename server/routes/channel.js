import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { createChannel, getUserChannels } from "../controllers/channel.js";

const router = Router()

router.post("/create-channel", verifyToken, createChannel)
router.get('/get-user-channels', verifyToken, getUserChannels)

export default router;