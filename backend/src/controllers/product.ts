import mongoose from "mongoose";
import { Product, Category } from "../models/products";
import { tryCatch } from "../utils/tryCatch";
import { Response } from "express";
import { User } from "../models/user";
import { Vendor } from "../models/vendor";
import moment from "moment";




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


const getProducts =tryCatch(
  async (req: any, res: Response): Promise<any> => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const { keyword, from, to, lat, lng, radius } = req.query;

    const finalAggregate: any[] = [];

    // Join with vendor to get location
    finalAggregate.push({
      $lookup: {
        from: "vendors",
        localField: "vendor", // assuming Product has `vendor: ObjectId`
        foreignField: "_id",
        as: "vendor",
      },
    });

    // Flatten the vendor array
    finalAggregate.push({ $unwind: "$vendor" });

    // Location filter via vendor's geo location
    if (lat && lng && radius) {
      finalAggregate.push({
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(lng as string), parseFloat(lat as string)],
          },
          distanceField: "vendor.distance",
          maxDistance: parseFloat(radius as string) * 1000,
          spherical: true,
          key: "vendor.location", // assumes Vendor has `location: { type: Point, coordinates: [] }`
        },
      });
    }

    // Date filtering
    if (from) {
      const utcFrom = moment
        .utc(from as string, "YYYY-MM-DD")
        .startOf("day")
        .toDate();
      finalAggregate.push({ $match: { createdAt: { $gte: utcFrom } } });
    }

    if (to) {
      const utcTo = moment
        .utc(to as string, "YYYY-MM-DD")
        .endOf("day")
        .toDate();
      finalAggregate.push({ $match: { createdAt: { $lte: utcTo } } });
    }

    // Keyword search (product name or vendor name)
    if (keyword) {
      const regex = new RegExp((keyword as string).toLowerCase(), "i");
      finalAggregate.push({
        $match: {
          $or: [
            { name: { $regex: regex } },
            { "vendor.fullName": { $regex: regex } },
          ],
        },
      });
    }

    // Sort by newest products
    finalAggregate.push({ $sort: { createdAt: -1 } });

    // Aggregate with pagination
    const myAggregate = Product.aggregate(finalAggregate);
    const products = await (Product as any).aggregatePaginate(myAggregate, {
      page,
      limit,
    });

    res.status(200).json({
      success: true,
      message: `${products.docs.length} products found`,
      data: products,
    });
  } );

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

export { CreateVendorProduct, GetAllCategories, getAllVendorProducts };