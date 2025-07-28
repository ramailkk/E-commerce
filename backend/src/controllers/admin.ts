import { Request, Response } from "express";
import moment from "moment";
import { User } from "../models/user";
import { Vendor } from "../models/vendor";
import { Product, Category } from "../models/products";
import { tryCatch } from "../utils/tryCatch";

const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const { keyword, from, to } = req.query;

    const finalAggregate: any[] = [];

    // Sort by newest
    finalAggregate.push({ $sort: { createdAt: -1 } });

    // Only non-admin users
    finalAggregate.push({ $match: { role: "user" } });

    // Date filters
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

    // Keyword filter
    if (keyword) {
      const regex = new RegExp((keyword as string).toLowerCase(), "i");
      finalAggregate.push({ $match: { fullName: { $regex: regex } } });
    }

    // Run aggregate + paginate
    const myAggregate = User.aggregate(finalAggregate);
    const users = await (User as any).aggregatePaginate(myAggregate, {
      page,
      limit,
    });

    res.status(200).json({
      success: true,
      message: `${users.docs.length} users found`,
      data: users,
    });
  } catch (error: any) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};
const getUser = tryCatch(async (req: any, res: Response): Promise<any> => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({
      message: "User ID is required",
    });
  }

  const user = await User.findById(userId);

  if (!user || user.role === "admin" || user.role === "vendor") {
    return res.status(404).json({
      message: "User not found or not allowed",
    });
  }

  return res.status(200).json({
    message: "User found",
    user,
  });
});

const getVendors = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const { keyword, from, to, lat, lng, radius } = req.query;

    const finalAggregate: any[] = [];

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

    // Sort by newest
    finalAggregate.push({ $sort: { createdAt: -1 } });

    // Date filters
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

    // Keyword filter
    if (keyword) {
      const regex = new RegExp((keyword as string).toLowerCase(), "i");
      finalAggregate.push({ $match: { fullName: { $regex: regex } } });
    }

    // Run aggregate + paginate
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
  } catch (error: any) {
    console.error("Error fetching vendors:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

const getVendor = tryCatch(async (req: any, res: Response): Promise<any> => {
  const { vendorId } = req.params;

  if (!vendorId) {
    return res.status(400).json({
      message: "Vendor ID is required",
    });
  }

  const vendor = await Vendor.findById(vendorId);

  if (!vendor) {
    return res.status(404).json({
      message: "Vendor not found",
    });
  }

  return res.status(200).json({
    message: "Vendor found",
    vendor,
  });
});

const updateUserStatus = tryCatch(
  async (req: any, res: Response): Promise<any> => {
    const { userId } = req.params;
    const { status } = req.body;

    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }
    if (!userId) {
      return res.status(400).json({
        message: "User Id Required",
      });
    }

    const user = await User.findByIdAndUpdate(
      { _id: userId, role: { $nin: ["admin", "vendor"] } }, //exclude admin/vendor
      { status },
      { new: true }, // returns the updated user
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User status updated successfully",
      user,
    });
  },
);

const updateVendorStatus = tryCatch(
  async (req: any, res: Response): Promise<any> => {
    const { vendorId } = req.params;
    const { status } = req.body;

    if (!vendorId) {
      return res.status(400).json({
        message: "Vendor Id required",
      });
    }

    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const vendor = await Vendor.findByIdAndUpdate(
      { _id: vendorId }, //exclude admin/vendor
      { status },
      { new: true }, // returns the updated user
    );

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vendor status updated successfully",
      vendor,
    });
  },
);

const deleteUser = tryCatch(async (req: any, res: Response): Promise<any> => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({
      message: "User Id is required",
    });
  }

  const user = await User.findByIdAndDelete({
    _id: userId,
    role: { $nin: ["admin", "vendor"] },
  });

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }
  res.status(200).json({
    message: "user deleted successfully",
    user,
  });
});

const deleteVendor = tryCatch(async (req: any, res: Response): Promise<any> => {
  const { vendorId } = req.params;

  if (!vendorId) {
    return res.status(400).json({
      message: "Vendor Id is required",
    });
  }

  const vendor = await Vendor.findByIdAndDelete({
    _id: vendorId,
  });

  if (!vendor) {
    return res.status(404).json({
      message: "Vendor not found",
    });
  }
  res.status(200).json({
    message: "vendor deleted successfully",
    vendor,
  });
});

const addCategory = tryCatch(async (req: any, res: Response): Promise<any> => {
  const { name, description } = req.body;
  if (!name) {
    return res.status(400).json({
      message: "Category Name is required",
    });
  }

  if (await Category.findOne({ name })) {
    return res.status(400).json({
      message: "Category name already exists",
    });
  }

  const category = await Category.create({
    name: name,
    description: description,
  });

  if (!category) {
    return res.status(501).json({
      message: "No category created",
    });
  }
  res.status(200).json({
    message: "Category created successfully ",
    category,
  });
});

const updateCategory = tryCatch(
  async (req: any, res: Response): Promise<any> => {
    const { categoryId } = req.params;
    const { name, description } = req.body;

    // Check for duplicate name (case-insensitive)
    const existing = await Category.findOne({
      _id: { $ne: categoryId }, // Exclude current category
      name: { $regex: new RegExp(`^${name}$`, "i") }, // Case-insensitive match
    });

    if (existing) {
      return res.status(400).json({
        message: "Category name already exists",
      });
    }

    if (!categoryId) {
      return res.status(400).json({
        message: "Category ID is required",
      });
    }

    if (!name) {
      return res.status(400).json({
        message: "Category Name is required",
      });
    }

    const category = await Category.findByIdAndUpdate(
      { _id: categoryId },
      { name, description },
      { new: true },
    );

    if (!category) {
      return res.status(501).json({
        message: "Category Not Found",
      });
    }
    res.status(200).json({
      message: "Category updated successfully ",
      category,
    });
  },
);
const deleteCategory = tryCatch(
  async (req: any, res: Response): Promise<any> => {
    const { categoryId } = req.params;

    if (!categoryId) {
      return res.status(400).json({
        message: "Category ID is required",
      });
    }

    const category = await Category.findByIdAndDelete({ _id: categoryId });

    if (!category) {
      return res.status(501).json({
        message: "Category Not Found",
      });
    }
    res.status(200).json({
      message: "Category deleted successfully ",
      category,
    });
  },
);

export {
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
  deleteCategory,
};
