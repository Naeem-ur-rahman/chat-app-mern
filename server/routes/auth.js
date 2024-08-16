import { Router } from 'express'
import { login, signup, getUserInfo } from '../controllers/auth.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/signup', signup)
router.post('/login', login)
router.get('/user-info', verifyToken, getUserInfo)

export default router;