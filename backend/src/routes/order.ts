import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import {
  addOrder,
  getOrders
 } from "../controllers/order";
// import { isAdmin } from "../middlewares/isAdmin.middlewre";

const orderRouter = Router();

orderRouter.route("/add").post(verifyJWT, addOrder);
orderRouter.route("/orders").get(verifyJWT, getOrders);

export default orderRouter;
