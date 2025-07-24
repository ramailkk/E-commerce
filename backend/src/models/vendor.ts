import mongoose from "mongoose";
import { User } from "./user";
const vendorSchema = new mongoose.Schema({
  
  shopName: {
    type: String,
    required: true,
    trim: true,
  },
});

export const Vendor = User.discriminator("vendor", vendorSchema);
