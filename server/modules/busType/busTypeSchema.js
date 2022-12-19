const mongoose = require("mongoose");

const type = {
  _id: { type: mongoose.Schema.Types.ObjectId, required: false },
  number: { type: Number, required: false },
  name: { type: String, required: false },
};

const busTypeSchema = new mongoose.Schema(
  {
    english: { bus_type: { type: String, required: true } },
    amharic: { bus_type: { type: String, required: true } },
    oromifa: { bus_type: { type: String, required: true } },
    driver_seat_position: {
      type: String,
      required: true,
      enum: ["LEFT", "RIGHT"],
    },
    bus_type_column_left: type,
    bus_type_row_left: type,
    bus_type_column_right: type,
    bus_type_row_right: type,
    bus_type_cabin: type,
    bus_type_back: type,
    added_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
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

module.exports = mongoose.model("BusType", busTypeSchema);
