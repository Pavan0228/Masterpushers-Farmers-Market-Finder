import { Router } from "express";
import {
    orderAssign,
    orderProducts,
    getOrders,
} from "../controller/order.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
// import { findFarmer } from "../middlewares/findFarmer.js";
const orderRouter = Router();

orderRouter.post("/", verifyJWT, orderProducts);

orderRouter.put("/:orderId/assign", verifyJWT, orderAssign);

orderRouter.get("/",  getOrders);

export { orderRouter };
