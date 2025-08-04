const { ApiResponse } = require("../../Helpers");
const User = require("../../Models/User");
const Payment = require("../../Models/Payment");
const moment = require("moment");
const mongoose = require("mongoose");
require("dotenv").config;
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-08-01",
});

// Payment Config Controller
exports.sendPublicKey = async (req, res) => {
  try {
    res
      .status(200)
      .json(
        ApiResponse(
          { publishableKey: process.env.STRIPE_PUBLISHABLE_KEY },
          "Success",
          true
        )
      );
  } catch (error) {
    console.log(error);
    res.status(500).json(ApiResponse({}, error.message, false));
  }
};
// Create Payment Intent Controller
exports.createPaymentIntent = async (req, res) => {
  let { amount, currency } = req.body;
  var paymentMethods = await stripe.paymentMethods.list({
    customer: req.user.customerId,
    type: "card",
  });
  try {
    amount = Math.round(amount * 100);
    let paymentIntent;
    if (paymentMethods?.data?.length > 0) {
      paymentIntent = await stripe.paymentIntents.create({
        customer: req.user.customerId,
        amount,
        currency,
        automatic_payment_methods: { enabled: true },
      });
    } else {
      paymentIntent = await stripe.paymentIntents.create({
        customer: req.user.customerId,
        amount,
        currency,
        automatic_payment_methods: { enabled: true },
        setup_future_usage: "off_session",
      });
    }

    res.status(200).json(
      ApiResponse(
        {
          clientSecret: paymentIntent.client_secret,
          paymentMethods,
          // paymentMethodId: paymentMethods?.data[0].id,
        },
        "Payment Intent Created Successfully",
        true
      )
    );
  } catch (error) {
    console.log(error);
    res.status(500).json(ApiResponse({}, error.message, false));
  }
};
exports.getPaymentById = async (req, res) => {
  const payment = await Payment.findById(req.params.id);
  try {
    if (!payment) {
      return res.status(404).json(ApiResponse({}, "Payment Not Found!", false));
    }
    res.status(200).json(ApiResponse(payment, "Success", true));
  } catch (error) {
    console.log(error);
    res.status(500).json(ApiResponse({}, error.message, false));
  }
};
// Get All Payments Controller
exports.getAllPayments = async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const { from, to, keyword } = req.query;
  const finalAggregate = [];
  finalAggregate.push({
    $sort: {
      createdAt: -1,
    },
  });
  if (from) {
    const utcFrom = moment.utc(from, "YYYY-MM-DD").startOf("day").toDate();
    finalAggregate.push({
      $match: {
        createdAt: {
          $gte: utcFrom,
        },
      },
    });
  }
  if (to) {
    const utcTo = moment.utc(to, "YYYY-MM-DD").endOf("day").toDate();
    finalAggregate.push({
      $match: {
        createdAt: {
          $lte: utcTo,
        },
      },
    });
  }
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
  finalAggregate.push({
    $lookup: {
      from: "bookings",
      localField: "booking",
      foreignField: "_id",
      as: "booking",
    },
  });
  finalAggregate.push({
    $unwind: {
      path: "$booking",
      preserveNullAndEmptyArrays: true,
    },
  });
  if (keyword) {
    const regex = new RegExp(keyword.toLowerCase(), "i");
    finalAggregate.push({
      $match: {
        "user.firstName": { $regex: regex },
        "user.lastName": { $regex: regex },
      },
    });
  }
  const myAggregate =
    finalAggregate.length > 0
      ? Payment.aggregate(finalAggregate)
      : Payment.aggregate([]);
  Payment.aggregatePaginate(myAggregate, { page, limit })
    .then((payments) =>
      res
        .status(200)
        .json(
          ApiResponse(payments, `${payments.docs.length} payments found`, true)
        )
    )
    .catch((err) => {
      res.status(500).json(ApiResponse({}, err.message, false));
    });
};

exports.savePayment = async (req, res) => {
  const { paymentIntentId, amount, currency, event, description } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status === "succeeded") {
      let payment = new Payment({
        totalAmount: Number(amount) * 100,
        user: req.user._id,
        chargeId: paymentIntent.id,
        isPaid: true,
        event,
      });
      await payment.save();
      res.status(200).json({
        message: "Payment Succeeded!",
        status: true,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(ApiResponse({}, error.message, false));
  }
};

exports.getClientPaymentMethods = async (req, res) => {
  try {
    var paymentMethods = await stripe.paymentMethods.list({
      customer: req.user.customerId,
      type: "card",
    });
    res
      .status(200)
      .json(
        ApiResponse(paymentMethods, "Payment Methods Retrieved Successfully", true)
      );
  } catch (error) {
    console.log(error);
    res.status(500).json(ApiResponse({}, error.message, false));
  }
};