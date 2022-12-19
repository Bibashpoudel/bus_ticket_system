const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: false },
    lastname: { type: String, required: false },
    gender: { type: String, required: false },
    dob: { type: String, require: false },
    bus_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "bus",
      required: true,
    },
    email: { type: String, required: false },
    phone: { type: String, required: false },
    unique_id: { type: String, required: false },
    position: { type: String, enum: ["left", "right", "back", "cabin"] },
    column_id: { type: mongoose.Schema.Types.ObjectId, required: false },
    row_id: { type: mongoose.Schema.Types.ObjectId, required: false },
    cabin_id: { type: mongoose.Schema.Types.ObjectId, required: false },
    back_id: { type: mongoose.Schema.Types.ObjectId, required: false },
    seat_number: { type: Number, required: false },
    status: {
      type: String,
      enum: ["reserved", "booked", "unavailable", "sold-out", "canceled"],
      default: "reserved",
    },
    code_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "discountCode",
      required: false,
    },
    isPaid: { type: Boolean, required: true, default: false },
    isDeleted: { type: Boolean, required: true, default: false },
    date: { type: String, required: true },
    company_id: { type: mongoose.Schema.Types.ObjectId, ref: "company" },
    ticketed_by: {
      type: String,
      required: false,
      enum: ["counter", "online", "super-admin"],
    },
    payment_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "Payment",
    },
    ticket_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "Ticket",
    },
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
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    underscore: true,
  }
);

bookingSchema.virtual("ticket", {
  ref: "Ticket",
  localField: "_id",
  foreignField: "booking_id",
  justOne: true,
});

// bookingSchema.virtual("company", {
//   ref: "Company",
//   localField: "company_id",
//   foreignField: "user_id",
//   justOne: true,
// });

// tell Mongoose to retrieve the virtual fields
bookingSchema.set("toObject", { virtuals: true });
bookingSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("seatBooking", bookingSchema);
