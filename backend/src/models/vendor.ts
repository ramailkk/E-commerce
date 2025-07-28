import mongoose from "mongoose";
import { User } from "./user";
import mongoosePaginate from "mongoose-paginate-v2";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const locationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Point"],
    default: "Point",
    required: true,
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    required: true,
    index: "2dsphere",
  },
  address: {
    type: String,
  },
});

const vendorSchema = new mongoose.Schema({
  shopName: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: locationSchema,
    required: true,
  },
});

vendorSchema.plugin(mongoosePaginate);
vendorSchema.plugin(mongooseAggregatePaginate);
export const Vendor = User.discriminator("vendor", vendorSchema);
