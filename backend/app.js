import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { userRouter } from "./routers/user.routes.js";

dotenv.config({
    path: "./.env",
});

const app = express({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
});

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/auth", userRouter);

export { app };
