import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from "mongoose";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001
const databaseURL = process.env.DATABASE_URL;

const server = app.listen(port, () => console.log(`Server Started at http://localhost:${port}`));
mongoose
    .connect(databaseURL)
    .then(() => console.log("DB Connected Successfull."))
    .catch((e) => console.log("Error is : ", e))