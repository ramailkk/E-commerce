import express from "express";
import authRouter from "./auth";
import profileRouter from "./profile";
import productRouter from "./product";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/profile", profileRouter);
router.use("/product", productRouter);


export default router;
