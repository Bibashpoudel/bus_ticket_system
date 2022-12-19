const mongoose = require("mongoose");

const type = {
  bus_legal_name: { type: String, required: true },
  bus_name: { type: String, required: true },
  address: { type: String, required: true },
  contact_name: { type: String, required: true },
};

const companySchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    english: type,
    amharic: type,
    oromifa: type,
    telephone: { type: String, required: true },
    company_logo: { type: String, required: false },
    bus_image: { type: String, required: false },
    commission_rate: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
    added_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    underscore: true,
  }
);

module.exports = mongoose.model("Company", companySchema);
