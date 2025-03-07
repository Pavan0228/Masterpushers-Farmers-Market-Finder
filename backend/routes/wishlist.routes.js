import express from "express";
import {
    addToWishlist,
    removeFromWishlist,
    getWishlist,
} from "../controllers/wishlist.controller.js";

const router = express.Router();

// Route to add a product to the wishlist
router.post("/:customerId/wishlist", addToWishlist);

// Route to remove a product from the wishlist
router.delete("/:customerId/wishlist", removeFromWishlist);

// Route to get all products in the wishlist
router.get("/:customerId/wishlist", getWishlist);

export default router;
