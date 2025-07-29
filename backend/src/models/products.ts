import mongoose from "mongoose";

import mongoosePaginate from "mongoose-paginate-v2";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "Name must be at least 3 characters"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    price: {
      type: Number,
      required: true,
      min: [0, "Price cannot be negative"],
    },

    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor", // because vendors are users
      required: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    profile: {
      type: String, // Single thumbnail or main image
      required: false,
      default: '',
    },

    images: {
      type: [String], // e.g. ["img1.jpg", "img2.jpg"]
      validate: {
        validator: function (val: string[]) {
          return val.length >= 4 && val.length <= 5;
        },
        message: "Product must have between 4 to 5 images",
      },
      default: [],
      required: false,
    },
  },
  { timestamps: true },
);

// Limit images between 4 to 5
function arrayLimit(val: any) {
  return val.length >= 4 && val.length <= 5;
}


const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 2,
  },

  description: {
    type: String,
    maxlength: 500,
  },

  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
});

productSchema.plugin(mongoosePaginate);
productSchema.plugin(mongooseAggregatePaginate);

export const Product = mongoose.model("Product", productSchema);
export const Category = mongoose.model("Category", categorySchema);
