const mongoose = require("mongoose");

const language = {
  name: { type: String, required: false },
  bus_number: { type: String, required: true },
  plate_number: { type: String, required: true },
  chasis: {
    type: String,
  },
  motor_number: {
    type: String,
  },
};

const busSchema = new mongoose.Schema(
  {
    english: language,
    amharic: language,
    oromifa: language,
    route_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
      required: false,
    },
    departure: { type: String, required: false },
    arrival: { type: String, required: false },
    bus_type_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BusType",
      required: false,
    },
    price: {
      usd: { type: Number, required: true },
      birr: { type: Number, required: true },
    },
    operation_date: {
      from: { type: Date, required: false },
      to: { type: Date, required: false },
    },
    recurring: {
      sunday: { type: Boolean, required: true, default: false },
      monday: { type: Boolean, required: true, default: false },
      tuesday: { type: Boolean, required: true, default: false },
      wednesday: { type: Boolean, required: true, default: false },
      thursday: { type: Boolean, required: true, default: false },
      friday: { type: Boolean, required: true, default: false },
      saturday: { type: Boolean, required: true, default: false },
    },
    image: [{ type: String, required: false }],
    review: {
      average: { type: String, default: null },
      punctuality: { type: String, default: null },
      service: { type: String, default: null },
      sanitation: { type: String, default: null },
      comfort: { type: String, default: null },
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

busSchema.virtual("Bus", {
  ref: "Review",
  localField: "_id",
  foreignField: "vehicle_id",
  justOne: true,
});

busSchema.virtual("SeatBooking", {
  ref: "seatBooking",
  localField: "_id",
  foreignField: "bus_id",
  justOne: true,
});

busSchema.virtual("SeatBookings", {
  ref: "seatBooking",
  localField: "_id",
  foreignField: "bus_id",
  justOne: false,
  match: { isDeleted: false, status: { $ne: "reserved" } },
});

busSchema.virtual("SeatBookingsCountAll", {
  ref: "seatBooking",
  localField: "_id",
  foreignField: "bus_id",
  justOne: false,
});

// busSchema.virtual("company", {
//   ref: "Company",
//   localField: "added_by",
//   foreignField: "user_id",
//   justOne: true,
// });

// tell Mongoose to retrieve the virtual fields
busSchema.set("toObject", { virtuals: true });
busSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("bus", busSchema);
