const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    firstname: { type: String, required: false },
    lastname: { type: String, required: false },
    bus_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "bus",
      required: true,
    },
    punctuality: {
      type: Number,
      required: false,
      enum: [0, 1, 2, 3, 4, 5],
      default: 0,
    },
    service: {
      type: Number,
      required: false,
      enum: [0, 1, 2, 3, 4, 5],
      default: 0,
    },
    sanitation: {
      type: Number,
      required: false,
      enum: [0, 1, 2, 3, 4, 5],
      default: 0,
    },
    comfort: {
      type: Number,
      required: false,
      enum: [0, 1, 2, 3, 4, 5],
      default: 0,
    },
    average: { type: Number, require: true },
    comment: { type: String, required: false },
    isPublic: { type: Boolean, default: false },
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

module.exports = mongoose.model("Review", reviewSchema);
