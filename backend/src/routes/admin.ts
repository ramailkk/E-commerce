import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import {
  getUsers,
  getUser,
  getVendors,
  getVendor,
  updateUserStatus,
  updateVendorStatus,
  deleteUser,
  deleteVendor,
  addCategory,
  updateCategory,
  deleteCategory
} from "../controllers/admin";
import { isAdmin } from "../middlewares/isAdmin.middleware";

const adminRouter = Router();

// UserManagment
adminRouter.route("/users").get(verifyJWT, isAdmin, getUsers);
adminRouter.route("/user/:userId").get(verifyJWT, isAdmin, getUser);
adminRouter.route("/user/ban/:userId").patch(verifyJWT, isAdmin, updateUserStatus);
adminRouter.route("/user/delete/:userId").delete(verifyJWT, isAdmin, deleteUser);

// VendorMangement
adminRouter.route("/vendors").get(verifyJWT, isAdmin, getVendors);
adminRouter.route("/vendor/:vendorId").get(verifyJWT, isAdmin, getVendor);
adminRouter.route("/vendor/ban/:vendorId").patch(verifyJWT, isAdmin, updateVendorStatus);
adminRouter.route("/vendor/delete/:vendorId").delete(verifyJWT, isAdmin, deleteVendor);

// Category
adminRouter.route("/category/add").put(verifyJWT, isAdmin, addCategory);
adminRouter.route("/category/update/:categoryId").patch(verifyJWT, isAdmin, updateCategory);
adminRouter.route("/category/delete/:categoryId").delete(verifyJWT, isAdmin, deleteCategory);

export default adminRouter;
