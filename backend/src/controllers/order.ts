import mongoose from "mongoose";
import { Product } from "../models/products";
import { Order } from "../models/order";
import { tryCatch } from "../utils/tryCatch";
import { isValidObjectId } from "../utils/validator";
import { Response } from "express";
import { User } from "../models/user";
import { Vendor } from "../models/vendor";
import moment from "moment";
import fs from "fs";
import path from "path";

const addOrder = tryCatch(async (req: any, res: Response) : Promise<any> =>{
  const userId = req.user?._id;
  const { items, shippingAddress } = req.body;

  if (req.user?.role !== "user")
    return res.status(400).json({ message: "Only users can place orders" });

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "No items in the order" });
  }

  // Validate and calculate totalAmount
  let totalAmount = 0;
  const validatedItems = [];

  for (const item of items) {
    const product = await Product.findById(item.product);

    if (!product) {
      return res
        .status(404)
        .json({ message: `Product not found: ${item.product}` });
    }

    const price = product.price; // fetch from DB to prevent manipulation
    const quantity = item.quantity || 1;

    validatedItems.push({
      product: product._id,
      quantity,
      price,
    });

    totalAmount += price * quantity;
  }

  const order = await Order.create({
    user: userId,
    items: validatedItems,
    shippingAddress,
    totalAmount,
  });

  return res.status(201).json({
    message: "Order placed successfully",
    order,
  });
});



const getOrders = async (req: any, res: Response): Promise<any> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const { keyword, from, to } = req.query;
    const userId = (req as any).user?._id;



    const finalAggregate: any[] = [];

    // Get only orders for user
    if (req.user?.role === 'user') {
      finalAggregate.push({
        $match: {
          user: userId,
        },
      });
    }

    // Populate user info if needed (optional)
    finalAggregate.push({
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    });

    finalAggregate.push({ $unwind: "$user" });

    // Populate product info from items
    finalAggregate.push({
      $unwind: "$items",
    });

    finalAggregate.push({
      $lookup: {
        from: "products",
        localField: "items.product",
        foreignField: "_id",
        as: "items.product",
      },
    });

    finalAggregate.push({
      $unwind: "$items.product",
    });

    // Date filters
    if (from) {
      const fromDate = moment
        .utc(from as string, "YYYY-MM-DD")
        .startOf("day")
        .toDate();
      finalAggregate.push({
        $match: { createdAt: { $gte: fromDate } },
      });
    }

    if (to) {
      const toDate = moment
        .utc(to as string, "YYYY-MM-DD")
        .endOf("day")
        .toDate();
      finalAggregate.push({
        $match: { createdAt: { $lte: toDate } },
      });
    }

    // Keyword filter (search user full name or product name)
    if (keyword) {
      const regex = new RegExp((keyword as string).toLowerCase(), "i");

      finalAggregate.push({
        $match: {
          $or: [
            { "user.fullName": { $regex: regex } },
            { "items.product.name": { $regex: regex } },
          ],
        },
      });
    }

    // Group back orders (because we unwound `items`)
    finalAggregate.push({
      $group: {
        _id: "$_id",
        user: { $first: "$user" },
        shippingAddress: { $first: "$shippingAddress" },
        status: { $first: "$status" },
        totalAmount: { $first: "$totalAmount" },
        createdAt: { $first: "$createdAt" },
        items: { $push: "$items" },
      },
    });

    // Sort by newest
    finalAggregate.push({ $sort: { createdAt: -1 } });

    // Pagination
    finalAggregate.push({ $skip: (page - 1) * limit }, { $limit: limit });

    const orders = await Order.aggregate(finalAggregate);

    const totalCount = await Order.countDocuments({ user: userId });

    res.status(200).json({
      success: true,
      message: `${orders.length} orders found`,
      data: orders,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
      },
    });
  } catch (error: any) {
    console.error("Error fetching orders:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};



const getOrder = tryCatch(async (req: any, res: Response): Promise<any> => {
  const { orderId } = req.params;
  const userId = req.user?._id;
  const role = req.user?.role;

  if (!orderId || !isValidObjectId(orderId)) {
    return res.status(400).json({
      message: "Valid Order ID is required",
    });
  }

  let order;

  if (role === "user") {
    // User can only access their own order
    order = await Order.findOne({ _id: orderId, user: userId });
  } else if (role === "vendor") {
    // Vendor can access orders that include at least one of their products
    order = await Order.findById(orderId).populate({
      path: "items.product",
      populate: { path: "vendor" , model: 'User' },
    });

    if (!order || !order.items.some((item: any) => item.product.vendor._id?.toString() === userId.toString())) {
      return res.status(403).json({ message: "Access denied: This order does not belong to you." });
    }
  } else if (role === "admin") {
    // Admin can access any order
    order = await Order.findById(orderId).populate({
      path: "items.product",
      populate: { path: "vendor", model: 'User' },
    });
  } else {
    return res.status(403).json({ message: "Unauthorized role" });
  }

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  return res.status(200).json({
    message: "Order found successfully",
    order,
  });
});


const updateOrder = tryCatch(async (req: any, res: Response): Promise<any> => {
  const userId = req.user?._id;
  const role = req.user?.role;
  const {orderId} = req.params;

  if (!isValidObjectId(orderId)){
    return res.status(400).json({
      message: "Order ID is not valid"
    })
  }
  if (!orderId){
    return res.status(400).json({
      message: "Order ID is required"
    })
  }

  const order = await Order.findById(orderId).populate({
  path: "items.product",
  populate: {
    path: "vendor",
    model: "User", // or "Vendor", depending on discriminator config
  },
});

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  const updates: any = {};
  const isEditable = ["pending", "confirmed"].includes(order.status);
  const newShippingAddress = req.body.shippingAddress;
  const requestedStatus = req.body.status;

  // === USER ROLE ===
  if (role === "user") {
    // Ensure the order belongs to the user
    if (order.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    console.log(newShippingAddress);
    // Check for status first i.e if user is trying to cancel so ignore the shipping Address
    if (requestedStatus === "cancelled" && isEditable) {
      updates.status = "cancelled";
      updates.cancelledAt = new Date();
    }
    // Allow shipping address updates if order is still editable and not cancelled
    else if (newShippingAddress && isEditable) {
      updates.shippingAddress = {
        ...order.shippingAddress,
        ...newShippingAddress,
      };
    }
  }

  // === ADMIN ROLE ===
  if (role === "admin") {
    if (requestedStatus && requestedStatus !== order.status) {
      updates.status = requestedStatus;

      if (requestedStatus === "confirmed") {
        updates.confirmedAt = new Date();
      } else if (requestedStatus === "delivered") {
        updates.deliveredAt = new Date();
      } else if (requestedStatus === "cancelled") {
        updates.cancelledAt = new Date();
      }
    }
  }

  // === VENDOR ROLE ===
  if (role === "vendor" && isEditable) {
  console.log("Vendor logic triggered");

  const vendorUpdates = req.body.items;
  if (!Array.isArray(vendorUpdates) || vendorUpdates.length === 0) {
    return res.status(400).json({ message: "No vendor updates provided" });
  }

  console.log("Vendor update input:", vendorUpdates);

  let hasChanged = false;

  const updatedItems = order.items.reduce((acc: any[], item: any) => {
    const productVendorId = item.product.vendor._id?.toString();
    const itemProductId = item.product._id.toString();

    console.log(`Checking item ${itemProductId} (owned by ${productVendorId})`);

    if (productVendorId !== userId.toString()) {
      console.log("hi")
      acc.push(item);
      return acc;
    }

    const change = vendorUpdates.find((v: any) => v.productId === itemProductId);

    if (!change) {
      hasChanged = true;
      console.log(`Removing product ${itemProductId}`);
      return acc; // Remove product
    }

    if (change.quantity < item.quantity && change.quantity >= 1) {
      hasChanged = true;
      console.log(`Updating quantity of ${itemProductId} from ${item.quantity} to ${change.quantity}`);
      acc.push({
        ...item.toObject(),
        quantity: change.quantity,
      });
      return acc;
    }

    acc.push(item); // Unchanged
    return acc;
  }, []);

  if (!hasChanged) {
    return res.status(400).json({ message: "No valid vendor changes detected" });
  }

  const newTotalAmount = updatedItems.reduce((total: number, item: any) => {
    return total + item.price * item.quantity;
  }, 0);

  updates.items = updatedItems;
  updates.totalAmount = newTotalAmount;
  updates.status = "pending";


   // === If vendor removed all their items and none remain
  if (updatedItems.length === 0) {
    console.log("All items removed — order is now empty.");

    // --- Option 1: Delete the order ---
    await Order.findByIdAndDelete(orderId);
    return res.status(200).json({ message: "Order deleted because no items remain" });

    // --- Option 2: Mark as cancelled instead ---
    /*
    updates.items = [];
    updates.totalAmount = 0;
    updates.status = "cancelled";
    updates.cancelledAt = new Date();
    const cancelledOrder = await Order.findByIdAndUpdate(orderId, updates, { new: true });
    return res.status(200).json(cancelledOrder);
    */
  }
}

  // === NO VALID UPDATES ===
  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ message: "No valid fields to update" });
  }

  const updatedOrder = await Order.findByIdAndUpdate(orderId, updates, {
    new: true,
  });

  return res.status(200).json(updatedOrder);
});

export default updateOrder;

export {
  addOrder,
  getOrders,
  getOrder,
  updateOrder
}