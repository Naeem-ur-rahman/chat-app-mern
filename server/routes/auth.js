import { Router } from 'express'
import { login, signup, getUserInfo, updateProfile, addProfileImage, reomveProfileImage } from '../controllers/auth.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import multer from 'multer'

const router = Router();
const uploads = multer({ dest: "uploads/profiles/" })

router.post('/signup', signup)
router.post('/login', login)
router.get('/user-info', verifyToken, getUserInfo)
router.post('/update-profile', verifyToken, updateProfile)
router.post('/add-profile-image', verifyToken, uploads.single('profile-image'), addProfileImage)
router.delete('/remove-profile-image', verifyToken, reomveProfileImage)
export default router;