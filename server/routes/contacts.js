import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { getContactsForDMList, searchContacts } from "../controllers/contacts.js";

const router = Router()

router.post('/search', verifyToken, searchContacts);
router.get('/get-contacts-for-dm', verifyToken, getContactsForDMList);

export default router;