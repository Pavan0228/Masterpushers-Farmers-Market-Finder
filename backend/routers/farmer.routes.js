import express from "express";
import { getFarmerDashboardOrders } from "../controller/farmar.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const farmerRouter = express.Router();

farmerRouter.get("/dashboard", verifyJWT, getFarmerDashboardOrders);

export { farmerRouter };
