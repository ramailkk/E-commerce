import mongoose from "mongoose";
import { Product, Category } from "../models/products";
import { tryCatch } from "../utils/tryCatch";
import { Response } from "express";
import { User } from "../models/user";

const getAllVendorProducts = tryCatch(
  async (req: any, res: Response): Promise<any> => {
    if (req.user?.role !== "vendor") {
      return res.status(401).json({
        message: "Not Authorized",
      });
    }

    const vendorId = req.user?._id;
    const allProducts = await Product.find({ vendor: vendorId });

    if (!allProducts) {
      return res.status(501).json({
        message: "No products found",
      });
    }

    res.status(200).json({
      message: "Products found ",
      allProducts,
    });
  },
);

const CreateVendorProduct = tryCatch(
  async (req: any, res: Response): Promise<any> => {
    if (req.user?.role !== "vendor") {
      return res.status(401).json({
        message: "Not Authorized",
      });
    }

    const { name, description, price, category_id } = req.body;
    const vendorId = req.user?._id;

    const createProduct = await Product.create({
      name: name,
      description: description,
      price: price,
      vendor: vendorId,
      category: category_id,
    });

    if (!createProduct) {
      return res.status(501).json({
        message: "No product created",
      });
    }

    res.status(200).json({
      message: "Product created successfully ",
      createProduct,
    });
  },
);

const CreateCategory = tryCatch(

  async (req: any, res: Response): Promise<any> => {
    
    if (req.user?.role !== "admin") {
      return res.status(401).json({
        message: "not authorized",
      });
    }
    const { name, description } = req.body;

    const newCategory = await Category.create({
      name: name,
      description: description,
    });

    if (!newCategory) {
      return res.status(501).json({
        message: "No category created",
      });
    }
    res.status(200).json({
      message: "Category created successfully ",
      newCategory,
    });
  },
);

const GetAllCategories = tryCatch(
  async (req: any, res: Response): Promise<any> => {
    const allCategories = await Category.find();

    if (!allCategories || allCategories.length === 0) {
      return res.status(404).json({
        message: "No categories found",
      });
    }
    res.status(200).json({
      message: "Categories found successfully ",
      allCategories,
    });
  },
);

export { CreateVendorProduct, CreateCategory, GetAllCategories, getAllVendorProducts };