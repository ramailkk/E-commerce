import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import {
  CreateVendorProduct,
  CreateCategory,
  GetAllCategories,
  getAllVendorProducts
}
  from "../controllers/product";
// import { isAdmin } from "../middlewares/isAdmin.middlewre";

const productRouter = Router();

productRouter.route("/add-product-vendor").put(verifyJWT, CreateVendorProduct);
productRouter.route("/add-category-admin").put(verifyJWT, CreateCategory);
productRouter.route("/get-categories").get(verifyJWT, GetAllCategories);
productRouter.route("/get-products-vendor").get(verifyJWT, getAllVendorProducts);



export default productRouter;
