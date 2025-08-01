import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import {
  addOrder,
  getOrders,
  getOrder,
  updateOrder
 } from "../controllers/order";
// import { isAdmin } from "../middlewares/isAdmin.middlewre";

const orderRouter = Router();

orderRouter.route("/add").post(verifyJWT, addOrder);
orderRouter.route("/orders").get(verifyJWT, getOrders);
orderRouter.route("/order/:orderId").get(verifyJWT, getOrder);
orderRouter.route("/update/:orderId").patch(verifyJWT, updateOrder);
export default orderRouter;
