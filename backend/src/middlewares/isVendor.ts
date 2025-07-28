// middleware/isAdmin.ts
import { Request, Response, NextFunction } from "express";
import { User } from "../models/user";

export const isVendor = (req: any, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== "vendor") {
    return res.status(403).json({ message: "Forbidden: Vendors only" });
  }
  next();
};

