import { Router } from 'express'
import { verifyToken } from '../middlewares/authMiddleware.js';
import { getMessages, removeFile, uploadFile } from '../controllers/messages.js';
import multer from "multer";

const router = Router();
const upload = multer({ dest: "uploads/files" });

router.post("/get-messages", verifyToken, getMessages);
router.post("/upload-file", verifyToken, upload.single("file"), uploadFile);
router.delete("/remove-file", verifyToken, removeFile);

export default router;