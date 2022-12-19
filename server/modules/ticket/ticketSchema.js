const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    validator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    booking_id: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "seatBooking",
        required: true,
      },
    ],
    date: { type: String },
    status: { type: String },
    departure_time: { type: String },
    date_time: { type: String },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    unique_id: { type: String, required: false },
    bus_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "bus",
      required: true,
    },
    read_ticket_id: {
      type: String,
      required: true,
    },
    route_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
      required: true,
    },
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    payment_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },
    passenger_name: {
      type: String,
      required: false,
    },
    isValidated: { type: Boolean, required: false, default: false },
    isCanceled: { type: Boolean, required: false, default: false },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    underscore: true,
  }
);

// tell Mongoose to retrieve the virtual fields
ticketSchema.set("toObject", { virtuals: true });
ticketSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Ticket", ticketSchema);
