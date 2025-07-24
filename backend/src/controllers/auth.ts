import { Request, Response } from "express";
import { User } from "../models/user";
import { Vendor } from "../models/vendor";
import sendEmail from "../utils/nodeMailer";
import { tryCatch } from "../utils/tryCatch";

const signup = tryCatch(async (req: Request, res: Response): Promise<any> => {
  const { fullName, email, password, role} = req.body;

  // check if email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Email already exists" });
  }

  let user;

  if (role !== "vendor") {
    user = await User.create({
      fullName,
      email,
      password,
      role, // optional, only needed if role isn't 'user' by default
    });
  } else {
    const { shopName } = req.body;
    user = await Vendor.create({
      fullName,
      email,
      password,
      role,
      shopName
    });
  }

  if (!user) {
    return res.status(501).json({
      message: "something went wrong while creating user",
    });
  }

  res.status(200).json({
    message: " user created successfully!",
    user,
  });
});

const login = tryCatch(async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide email and password" });
  }
  const user: any = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // check for user
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // generate JWT
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  const cookieOptions = {
    httpOnly: true,
    secure: true,
  };

  res.cookie("refreshToken", refreshToken, cookieOptions);
  res.cookie("accessToken", accessToken, cookieOptions);

  res.status(200).json({
    message: "Logged in successfully!",
    user,
    accessToken,
    refreshToken,
  });
});

const logout = tryCatch(async (req: any, res: Response): Promise<any> => {
  await User.findByIdAndUpdate(
    req?.user?._id,
    {
      $set: {
        refreshToken: null,
      },
    },
    {
      new: true,
    },
  );

  const options = {
    httpOnly: false,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({
      message: "Logged out successfully!",
    });
});

const forgotPassword = tryCatch(
  async (req: Request, res: Response): Promise<any> => {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Please provide email" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(1000 + Math.random() * 9000);

    user.otp = otp;
    await user.save({ validateBeforeSave: false });

    const message = `Your Otp Verification Code is ${otp}`;

    await sendEmail(user.email, "Password Reset Request", message);

    res.status(200).json({
      message: "Reset password email sent successfully!",
    });
  },
);

const verifyOtp = tryCatch(
  async (req: Request, res: Response): Promise<any> => {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    res.status(200).json({
      message: "Otp Confirmed!",
    });
  },
);

const resetPassword = tryCatch(
  async (req: Request, res: Response): Promise<any> => {
    const { email, password, otp } = req.body;

    if (!email || !password || !otp) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    const user: any = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    user.otp = null;
    user.password = password;
    await user.save();

    res.status(200).json({
      message: "Password Reset Successfully!",
    });
  },
);

const changePassword = tryCatch(
  async (req: any, res: Response): Promise<any> => {
    const { oldPassword, newPassword } = req.body;
    const user: any = await User.findById(req.user._id).select("-otp");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // check for user
    const isPasswordValid = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Wrong Old Password" });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      message: "Password updated successfully!",
      user,
    });
  },
);

export {
  changePassword,
  forgotPassword,
  login,
  logout,
  resetPassword,
  signup,
  verifyOtp,
};
