const mongoose = require("mongoose");
const details = {
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  isActive: { type: Boolean, default: true },
  distance: { type: String, required: true },
};
const routeSchema = new mongoose.Schema(
  {
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },
    added_by: [details],
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

module.exports = mongoose.model("Route", routeSchema);
