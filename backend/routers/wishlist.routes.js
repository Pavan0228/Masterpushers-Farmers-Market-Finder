import express from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { addToWishlist, removeFromWishlist, getWishlist } from "../controller/wishlist.controller.js";

const router = express.Router();

router.post("/", verifyJWT, addToWishlist);

router.delete("/", verifyJWT, removeFromWishlist);

router.get("/", verifyJWT, getWishlist);

export default router;