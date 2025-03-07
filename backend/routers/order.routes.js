import { Router } from "express";
import { orderAssign, orderProducts } from "../controller/order.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const orderRouter = Router();

orderRouter.post("/", verifyJWT, orderProducts);

orderRouter.put("/:orderId/assign", verifyJWT, orderAssign);


export { orderRouter };
