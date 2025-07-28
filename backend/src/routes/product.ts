import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import {
  CreateVendorProduct,
  GetAllCategories,
  getAllVendorProducts
}
  from "../controllers/product";
import { isAdmin } from "../middlewares/isAdmin.middleware";

const productRouter = Router();

productRouter.route("/add-product-vendor").put(verifyJWT, CreateVendorProduct);
productRouter.route("/get-categories").get(verifyJWT, GetAllCategories);
productRouter.route("/get-products-vendor").get(verifyJWT, getAllVendorProducts);



export default productRouter;
