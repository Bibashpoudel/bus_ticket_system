const mongoose = require("mongoose");

const discountCodeSchema = new mongoose.Schema(
  {
    code: { type: String, required: false },
    code_type: { type: String, required: false, default: "discount" },
    amount: {
      usd: { type: Number, required: false },
      birr: { type: Number, required: false },
    },
    percent: { type: Number, required: false },
    used_count: { type: Number, required: false, default: 0 },
    added_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    start_date: { type: Date, required: false },
    end_date: { type: Date, required: false },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    underscore: true,
  }
);

module.exports = mongoose.model("discountCode", discountCodeSchema);
