import { Router } from "express";
import { upload } from "../middlewares/upload";
import { verifyJWT } from "../middlewares/auth.middleware";
import {
  addProduct,
  GetAllCategories,
  getAllVendorProducts,
  getProduct,
  getProducts,
  deleteProduct,
  updateProductImages
}
  from "../controllers/product";
import { isAdmin } from "../middlewares/isAdmin.middleware";
import { isVendor } from "../middlewares/isVendor.middleware"
import express from "express";
const router = express.Router();

const productRouter = Router();

productRouter.route("/add-product-vendor").post(verifyJWT, upload, addProduct);
productRouter.route("/get-categories").get(verifyJWT, GetAllCategories);
productRouter.route("/get-products-vendor").get(verifyJWT, getAllVendorProducts);
productRouter.route("/products").get(getProducts);
productRouter.route("/product/:productId").get(getProduct);
productRouter.route("/delete/:productId").delete(verifyJWT, isVendor, deleteProduct)
productRouter.route("/update/:productId").patch(verifyJWT, isVendor, upload, updateProductImages);


export default productRouter;
