import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from "mongoose";

import authRoutes from './routes/auth.js'
import contactsRoutes from './routes/contacts.js'
import messagesRoutes from './routes/messages.js'
import setupSocket from "./socket.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001
const databaseURL = process.env.DATABASE_URL;

app.use(cors({
    origin: [process.env.ORIGIN],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
}))

app.use('/uploads/profiles/', express.static('uploads/profiles/'));

app.use(cookieParser())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/contacts', contactsRoutes)
app.use('/api/messages', messagesRoutes)

mongoose.connect(databaseURL)
    .then(() => console.log("DB Connected Successfull."))
    .catch((e) => console.log("Error is : ", e));

const server = app.listen(port, () => console.log(`Server Started at http://localhost:${port}`));

setupSocket(server);