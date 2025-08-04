const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const Schema = mongoose.Schema;

const paymentSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    chargeId: {
      type: String,
      required: false, // You can make it required: true if needed
    },
  },
  { timestamps: true },
);

paymentSchema.plugin(mongoosePaginate);
paymentSchema.plugin(aggregatePaginate);

export const Payment = mongoose.model("Payment", paymentSchema);
