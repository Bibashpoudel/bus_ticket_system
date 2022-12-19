const mongoose = require("mongoose");

const cancelTripSchema = new mongoose.Schema(
  {
    bus_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "bus",
      required: true,
    },
    date: { type: String, required: false },
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
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    underscore: true,
  }
);

module.exports = mongoose.model("CanceledTrip", cancelTripSchema);
