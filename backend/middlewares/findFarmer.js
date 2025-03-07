import { Farmer } from "../models/farmer.model.js";
import { User } from "../models/user.model.js";

export const findFarmer = async (req, res, next) => {
    const farmer = await Farmer.findOne({ user: req.user._id });
    if (!farmer) return next(new Error("Farmer not found"));
    req.farmer = farmer;
    next();
};