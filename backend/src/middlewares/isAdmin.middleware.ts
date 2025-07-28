import { Request, Response, NextFunction } from "express";


export const isAdmin = (
  req: any,
  res: Response,
  next: NextFunction,
): void => {
  const user = req.user; // You must have user attached in previous auth middleware

  if (!user || user.role !== "admin") {
    res
      .status(403)
      .json({ success: false, message: "Access denied. Admins only." });
    return;
  }

  next(); // Proceed if admin
};
