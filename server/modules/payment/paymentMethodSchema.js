const mongoose = require("mongoose");

const paymentMethodSchema = new mongoose.Schema(
  {
    paypal_client_id: { type: String, required: false },
    paypal_secret_key: { type: String, required: false },
    telebirr_account: { type: String, required: false },
    cbe_account: { type: String, required: false },
    telebirr_charge: { type: Number, required: false },
    ticket_price_usd: { type: Number, required: false },
    added_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    company_id: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    underscore: true,
  }
);

module.exports = mongoose.model("PaymentMethod", paymentMethodSchema);
