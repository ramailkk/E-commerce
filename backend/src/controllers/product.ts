import mongoose from "mongoose";
import { Product, Category } from "../models/products";
import { tryCatch } from "../utils/tryCatch";
import { isValidObjectId } from "../utils/validator";
import { Response } from "express";
import { User } from "../models/user";
import { Vendor } from "../models/vendor";
import moment from "moment";
import fs from "fs";
import path from "path";

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

const getProducts = tryCatch(async (req: any, res: Response): Promise<any> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const { keyword, from, to, lat, lng, radius } = req.query;

  const finalAggregate: any[] = [];

  // 1. GeoNear must be first
  if (lat && lng && radius) {
    finalAggregate.push({
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [parseFloat(lng as string), parseFloat(lat as string)],
        },
        distanceField: "distance", // adds a 'distance' field in meters
        maxDistance: parseFloat(radius as string) * 1000, // Convert km to meters
        spherical: true,
      },
    });
  }

  finalAggregate.push({
    $lookup: {
      from: "products",
      localField: "_id", // vendor's _id
      foreignField: "vendor", // product's vendor reference
      as: "products",
    },
  });

  finalAggregate.push({
    $addFields: {
      products: {
        $filter: {
          input: "$products",
          as: "product",
          cond: {
            $and: [
              // Date filter
              ...(from
                ? [
                    {
                      $gte: [
                        "$$product.createdAt",
                        new Date(
                          moment
                            .utc(from as string)
                            .startOf("day")
                            .toISOString(),
                        ),
                      ],
                    },
                  ]
                : []),
              ...(to
                ? [
                    {
                      $lte: [
                        "$$product.createdAt",
                        new Date(
                          moment
                            .utc(to as string)
                            .endOf("day")
                            .toISOString(),
                        ),
                      ],
                    },
                  ]
                : []),
              // Keyword match
              ...(keyword
                ? [
                    {
                      $regexMatch: {
                        input: { $toLower: "$$product.name" },
                        regex: keyword.toLowerCase(),
                      },
                    },
                  ]
                : []),
            ],
          },
        },
      },
    },
  });

  finalAggregate.push({
    $project: {
      _id: 1,
      fullName: 1,
      status: 1,
      shopName: 1,
      location: 1,
      distance: 1,
      products: 1, // this is an array now
    },
  });

  // 6. Paginate
  const myAggregate = Vendor.aggregate(finalAggregate);
  const vendors = await (Vendor as any).aggregatePaginate(myAggregate, {
    page,
    limit,
  });

  res.status(200).json({
    success: true,
    message: `${vendors.docs.length} vendors found`,
    data: vendors,
  });
});

const addProduct = tryCatch(async (req: any, res: Response): Promise<any> => {
  const { name, description, price, categoryid } = req.body;
  const vendorId = req.user?._id;
  console.log(price);
  // Multer stores file data in req.files

  const images =
    req.files?.images?.map((file: Express.Multer.File) => file.filename) || [];

  const profile = req.files?.profile?.[0]?.filename || null;
  console.log(images);
  if (images.length < 4 || images.length > 5) {
    return res.status(400).json({
      message: "Please upload between 4 to 5 product images",
    });
  }

  const product = await Product.create({
    name,
    description,
    price,
    vendor: vendorId,
    category: categoryid,
    images,
    profile,
  });

  if (!product) {
    return res.status(501).json({
      message: "Product was not created",
    });
  }

  res.status(200).json({
    message: "Product created successfully",
    product,
  });
});

const GetAllCategories = tryCatch(
  async (req: any, res: Response): Promise<any> => {
    const Categories = await Category.find();

    if (!Categories || Categories.length === 0) {
      return res.status(404).json({
        message: "No categories found",
      });
    }
    res.status(200).json({
      message: "Categories found successfully ",
      Categories,
    });
  },
);

const getProduct = tryCatch(async (req: any, res: Response): Promise<any> => {
  const { productId } = req.params;


  if (!productId) {
    return res.status(400).json({
      message: "Product ID is required",
    });
  }

  const product = await Product.findById({ _id: productId });

  if (!product) {
    return res.status(404).json({
      message: "Product Not Found",
    });
  }

  res.status(200).json({
    message: "Product Found Successfully",
    product,
  });
});

const deleteProduct = tryCatch(
  async (req: any, res: Response): Promise<any> => {
    const { productId } = req.params;

    const vendorId = req.user?.id;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const product = await Product.findById({
      _id: productId,
      vendor: vendorId,
    });

    if (!product) {
      return res.status(404).json({ message: "Product Not Found" });
    }

    // Delete images from filesystem
    const deleteFile = (filename: string) => {
      const filePath = path.join(path.resolve("uploads"), filename);
      fs.unlink(filePath, (err) => {
        if (err && err.code !== "ENOENT") {
          console.error("Failed to delete file:", filename, err);
        }
      });
    };

    if (product.profile) deleteFile(product.profile);

    if (product.images && Array.isArray(product.images)) {
      product.images.forEach((img: any) => deleteFile(img));
    }

    // Delete product from DB
    await product.deleteOne();

    res.status(200).json({
      message: "Product Deleted Successfully",
      product,
    });
  },
);



const getUploadedFilenames = (req: any) =>
  req.files?.images?.map((f: any) => f.filename) || [];

const updateProductImages = tryCatch(async (req: any, res: Response): Promise<any> => {
  const { productId } = req.params;
  const uploadedImages = getUploadedFilenames(req);

  if (!isValidObjectId(productId)) {
    deleteFiles(uploadedImages);
    return res.status(400).json({
      message: "Product ID is not Valid",
    });
  }

  let imagesToDelete: string[] = [];
  if (req.body.imagesToDelete) {
    try {
      imagesToDelete = JSON.parse(req.body.imagesToDelete);
    } catch (error) {
      deleteFiles(uploadedImages);
      return res.status(400).json({ message: "Invalid imagesToDelete format" });
    }
  }

  if (!productId || imagesToDelete.length === 0) {
    deleteFiles(uploadedImages);
    return res.status(400).json({
      message: "Product ID and Images to delete is required",
    });
  }

  const images = uploadedImages;

  const product = await Product.findById(productId);
  if (!product) {
    deleteFiles(images);
    return res.status(404).json({ message: "Product not found" });
  }

  if (images.length !== imagesToDelete.length || images.length === 0) {
    deleteFiles(images);
    return res.status(400).json({
      message:
        "New Images are required to be the same number as ones to delete",
    });
  }

  const allImagesExist = imagesToDelete.every((img) =>
    product.images.includes(img),
  );
  if (!allImagesExist) {
    deleteFiles(images);
    return res.status(400).json({
      message:
        "One or more images to delete are not part of the product's images",
    });
  }

  const finalImageCount =
    product.images.length - imagesToDelete.length + images.length;
  if (finalImageCount < 4 || finalImageCount > 5) {
    deleteFiles(images);
    return res.status(400).json({
      message: `Final image count must be between 4 and 5. Resulting count: ${finalImageCount}`,
    });
  }

  // Finally: delete from DB & disk
  product.images = product.images.filter((img: string) => {
    if (imagesToDelete.includes(img)) {
      const imgPath = path.join(path.resolve("uploads"), img);
      fs.unlink(imgPath, (err) => {
        if (err && err.code !== "ENOENT") {
          console.error("Failed to delete image file:", img);
        }
      });
      return false;
    }
    return true;
  });

  product.images.push(...images);
  await product.save();

  return res.status(200).json({
    message: "Product images updated successfully",
    images: product.images,
  });
});


export const updateProfilePicture = tryCatch(async (req: any, res: Response): Promise<any> => {
  const { productId } = req.params;
  const uploadedImage = req.file?.filename;

  if (!isValidObjectId(productId)) {
    if (uploadedImage) deleteFiles([uploadedImage]);
    return res.status(400).json({ message: "Product ID is not valid" });
  }

  if (!uploadedImage) {
    return res.status(400).json({ message: "No profile picture uploaded" });
  }

  const product = await User.findById(productId);
  if (!product) {
    deleteFiles([uploadedImage]);
    return res.status(404).json({ message: "User not found" });
  }

  // Delete old image if it exists
  if (product.profilePicture) {
    const oldImagePath = path.join(path.resolve("uploads"), product.profilePicture);
    fs.unlink(oldImagePath, (err) => {
      if (err && err.code !== "ENOENT") {
        console.error("Failed to delete old profile picture:", product.profilePicture);
      }
    });
  }

  product.profilePicture = uploadedImage;
  await product.save();

  return res.status(200).json({
    message: "Profile picture updated successfully",
    profilePicture: uploadedImage,
  });
});

const deleteFiles = (filenames: string[]) => {
  for (const file of filenames) {
    const filePath = path.join(path.resolve("uploads"), file); // adjust path if needed
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};





const updateProduct = tryCatch(
  async (req: any, res: Response): Promise<any> => {
    const { name, description, price, categoryid } = req.body;
    const vendorId = req.user?._id;
    console.log(price);
    // Multer stores file data in req.files

    const images =
      req.files?.images?.map((file: Express.Multer.File) => file.filename) ||
      [];

    const profile = req.files?.profile?.[0]?.filename || null;
    console.log(images);
    if (images.length < 4 || images.length > 5) {
      return res.status(400).json({
        message: "Please upload between 4 to 5 product images",
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      vendor: vendorId,
      category: categoryid,
      images,
      profile,
    });

    if (!product) {
      return res.status(501).json({
        message: "Product was not created",
      });
    }

    res.status(200).json({
      message: "Product created successfully",
      product,
    });
  },
);

export {
  addProduct,
  getProduct,
  GetAllCategories,
  getAllVendorProducts,
  getProducts,
  deleteProduct,
  updateProductImages,
};
