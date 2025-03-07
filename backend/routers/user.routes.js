import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
    loginUser,
    logoutUser,
    registerUser,
    updateUserProfile,
} from "../controller/auth.controller.js";
import { upload } from "../utils/s3Upload.js";

const userRouter = Router();

userRouter.post("/signup", upload, registerUser);
userRouter.post("/login", loginUser);
userRouter.patch("/update-profile", verifyJWT, upload, updateUserProfile);
userRouter.get("/logout", verifyJWT, logoutUser);

export { userRouter };
