import { Router } from "express";
import { orderProducts } from "../controller/order.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const orderRouter = Router();

orderRouter.post("/", verifyJWT, orderProducts);


export { orderRouter };
