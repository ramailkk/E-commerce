import { Request, Response } from "express";
import moment from "moment";
import { User } from "../models/user";
import { Vendor } from "../models/vendor";
import { Product, Category } from "../models/products";
import { tryCatch } from "../utils/tryCatch";

const addProduct = tryCatch(
  async (req: any, res: Response): Promise<any> => {
    const { name, description, price, category_id } = req.body;
    const vendorId = req.user?._id;

    const product = await Product.create({
      name: name,
      description: description,
      price: price,
      vendor: vendorId,
      category: category_id,
    });

    if (!product) {
      return res.status(501).json({
        message: "No product created",
      });
    }

    res.status(200).json({
      message: "Product created successfully ",
      product,
    });
  },
);