// MAYBE REWORK THIS MIDDLEWARE FOR BOTH ADMIN AND VENDORS

import { Request, Response, NextFunction } from "express";


export const isVendor = (
  req: any,
  res: Response,
  next: NextFunction,
): void => {
  const user = req.user; // You must have user attached in previous auth middleware

  if (!user || user.role !== "vendor") {
    res
      .status(403)
      .json({ success: false, message: "Access denied. Vendors only."});
    return;
  }

  next(); // Proceed if admin
};
