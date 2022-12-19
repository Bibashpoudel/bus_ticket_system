const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    transaction_id: { type: String, required: false },
    currency: { type: String, required: false, default: "birr" },
    unique_id: { type: String, required: false },
    booking_id: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "seatBooking",
        required: false,
      },
    ],
    ticket_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
      required: false,
    },
    bus_fee: { type: Number, required: true },
    amount: { type: Number, required: true },
    payment_type: {
      type: String,
      required: true,
      enum: [
        "telebirr",
        "wallet",
        "card",
        "cash",
        "cash-deposit",
        "bank-transfer",
        "cbe",
        "paypal",
      ],
    },
    payment_gateway: { type: String, required: false },
    status: {
      type: String,
      required: false,
      enum: ["paid", "unpaid", "pending", "canceled"],
      default: "unpaid",
    },
    discount_code: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "discountCode",
      required: false,
      default: null,
    },
    isSettled: { type: Boolean, required: true, default: false },
    reference_number: { type: String, required: false },
    receipt: { type: String, required: false },
    comission: { type: Number },
    processing: { type: Number },
    booked_date: { type: String },
    discount: { type: Number },
    bus_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "bus",
      required: true,
    },
    added_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: false,
    },
    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    underscore: true,
  }
);

module.exports = mongoose.model("Payment", paymentSchema);
