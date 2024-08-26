import { Router } from 'express'
import { verifyToken } from '../middlewares/authMiddleware.js';
import { getMessages } from '../controllers/messages.js';

const router = Router();

router.post("/get-messages", verifyToken, getMessages);

export default router;