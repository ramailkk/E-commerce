import { ApiResponse } from "../utils/apiResponse";
// import User from "../../Models/User";
import { Payment } from "../models/payment";
import moment from "moment";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Stripe from "stripe";
import { Request, Response } from "express";

// Load environment variables
dotenv.config();

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// Payment Config Controller
const sendPublicKey = async (req: any, res: Response) => {
  try {
    res
      .status(200)
      .json(
        ApiResponse(
          { publishableKey: process.env.STRIPE_PUBLISHABLE_KEY },
          "Success",
          true,
        ),
      );
  } catch (error) {
    console.log(error);
    res.status(500).json(ApiResponse({}, (error as Error).message, false));
  }
};

// Create Payment Intent Controller (without Stripe customer)
const createPaymentIntent = async (req: any, res: Response): Promise<any> => {
  try {
    let { amount, currency } = req.body;
    if (!amount || !currency) {
      return res
        .status(400)
        .json(ApiResponse({}, "Amount and currency are required", false));
    }

    amount = Math.round(amount * 100); // Convert to smallest currency unit

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: { enabled: true },
    });

    return res.status(200).json(
      ApiResponse(
        {
          clientSecret: paymentIntent.client_secret,
        },
        "Payment Intent Created Successfully",
        true,
      ),
    );
  } catch (error) {
    console.error(error);
    res.status(500).json(ApiResponse({}, (error as Error).message, false));
  }
};

const getAllPaymentIntents = async (req: Request, res: Response) => {
  try {
    const paymentIntents = await stripe.paymentIntents.list({ limit: 100 });

    const formatted = paymentIntents.data.map((pi) => ({
      id: pi.id,
      status: pi.status,
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({ message: "Failed to fetch payment intents." });
  }
};

const savePayment = async (req: any, res: Response) => {
  const { paymentIntentId, amount, currency, orderId, description } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    console.log(paymentIntent.status);
    // SET THIS TO SUCCEEDED IN ACTUAL PRODUCTION
    if (paymentIntent.status === "requires_payment_method") {
      let payment = new Payment({
        totalAmount: Number(amount) * 100,
        user: req.user._id,
        chargeId: paymentIntent.id,
        isPaid: true,
        order: orderId,
      });
      await payment.save();
      res.status(200).json({
        message: "Payment Succeeded!",
        status: true,
      });
    } else {
      res.status(400).json({
        message: `Payment status is '${paymentIntent.status}', not 'succeeded'`,
        status: false,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(ApiResponse({}, (error as Error).message, false));
  }
};

const getPayments = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const { from, to, keyword } = req.query as {
    from?: string;
    to?: string;
    keyword?: string;
  };

  const finalAggregate: any[] = [];

  finalAggregate.push({ $sort: { createdAt: -1 } });

  if (from) {
    finalAggregate.push({
      $match: {
        createdAt: {
          $gte: moment.utc(from, "YYYY-MM-DD").startOf("day").toDate(),
        },
      },
    });
  }

  if (to) {
    finalAggregate.push({
      $match: {
        createdAt: {
          $lte: moment.utc(to, "YYYY-MM-DD").endOf("day").toDate(),
        },
      },
    });
  }

  // Lookup user
  finalAggregate.push({
    $lookup: {
      from: "users",
      localField: "user",
      foreignField: "_id",
      as: "user",
    },
  });

  finalAggregate.push({
    $unwind: {
      path: "$user",
      preserveNullAndEmptyArrays: true,
    },
  });

  // Keyword filtering (fullName)
  if (keyword) {
    const regex = new RegExp(keyword.trim(), "i");
    finalAggregate.push({
      $match: {
        $or: [
          { "user.firstName": { $regex: regex } },
          { "user.lastName": { $regex: regex } },
          {
            $expr: {
              $regexMatch: {
                input: { $concat: ["$user.firstName", " ", "$user.lastName"] },
                regex,
              },
            },
          },
        ],
      },
    });
  }

  try {
    const aggregate = Payment.aggregate(finalAggregate);
    const result = await Payment.aggregatePaginate(aggregate, { page, limit });

    res
      .status(200)
      .json(ApiResponse(result, `${result.docs.length} payments found`, true));
  } catch (error: any) {
    console.error("getAllPayments error:", error.message);
    res.status(500).json(ApiResponse({}, error.message, false));
  }
};

const getPaymentById = async (req: any, res: Response): Promise<any> => {
  const { paymentId } = req.params;

  if (!paymentId) {
    return res.status(404).json(ApiResponse({}, "Payment Id Required", false));
  }

  const payment = await Payment.findById(paymentId);
  try {
    if (!payment) {
      return res.status(404).json(ApiResponse({}, "Payment Not Found!", false));
    }
    res.status(200).json(ApiResponse(payment, "Success", true));
  } catch (error) {
    console.log(error);
    res.status(500).json(ApiResponse({}, (error as Error).message, false));
  }
};

export {
  sendPublicKey,
  createPaymentIntent,
  getAllPaymentIntents,
  savePayment,
  getPayments,
  getPaymentById
};
