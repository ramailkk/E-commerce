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
      ref: "User", // because vendors are users
      required: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    // images: {
    //   type: [String], // or Object with metadata if you store more
    //   validate: [arrayLimit, "Product must have 4 to 5 images"],
    //   required: false,
    // },
  },
  { timestamps: true },
);

// Limit images between 4 to 5
function arrayLimit(val: any) {
  return val.length >= 4 && val.length <= 5;
}

// Optional: hook to delete images from storage when product is deleted
// productSchema.pre(
//   "deleteOne",
//   { document: true, query: false },
//   async function () {
//     const product = this;
//     TODO: Add logic to delete images from cloud storage (e.g. S3, Cloudinary)
//     console.log("Deleting product images:", product.images);
//   },
// );

const categorySchema = new mongoose.Schema(
  {
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
  },
);

productSchema.plugin(mongoosePaginate);
productSchema.plugin(mongooseAggregatePaginate);

export const Product = mongoose.model("Product", productSchema);
export const Category = mongoose.model("Category", categorySchema);