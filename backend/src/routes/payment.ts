import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import {
  createPaymentIntent,
  getAllPaymentIntents,
  getPaymentById,
  getPayments,
  savePayment,
  sendPublicKey,
} from "../controllers/payment";
import { isAdmin } from "../middlewares/isAdmin.middleware";
import { isUser } from "../middlewares/isUser.middleware";
const paymentRouter = Router();

paymentRouter.route("/sendPublicKey").post(verifyJWT, isUser, sendPublicKey);
paymentRouter.route("/createIntent").post(verifyJWT, isUser, createPaymentIntent);
paymentRouter.route("/info").get(verifyJWT, getAllPaymentIntents);
paymentRouter.route("/save").post(verifyJWT, isUser, savePayment);
paymentRouter.route("/payments").get(verifyJWT, isAdmin, getPayments);
paymentRouter.route("/payment/:paymentId").get(verifyJWT, isAdmin, getPaymentById);

export default paymentRouter;
