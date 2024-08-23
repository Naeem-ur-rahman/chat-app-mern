import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { searchContacts } from "../controllers/contacts.js";

const router = Router()

router.post('/search', verifyToken, searchContacts);

export default router;