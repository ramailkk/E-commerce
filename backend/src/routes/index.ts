import express from "express";
import authRouter from "./auth";
import profileRouter from "./profile";
import productRouter from "./product";
import adminRouter from "./admin";
import orderRouter from "./order";
import paymentRouter from "./payment";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/profile", profileRouter);
router.use("/product", productRouter);
router.use("/admin", adminRouter);
router.use("/order", orderRouter);
router.use("/payment", paymentRouter);

export default router;
