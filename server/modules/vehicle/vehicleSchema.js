const mongoose = require('mongoose');

const desc = [{
  name: {type: String},
  isBooked: {type: Boolean, default: false},
  unique_id: {type: String, default: null},
}]

const vehicleSchema = new mongoose.Schema(
    {
      user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
      title: { type: String, required: true },
      date: {type: Date, required: true },
      time: {type: String, required: true },
      class_type: { type: String, required: true },
      image: [{ type: String, required: false }],
      to: { type: String, required: true },
      from: { type: String, required: true },
      price: { type: Number, required: true},
      total_seats: { type: Number, required: false },
      available_seats: { type: Number, required: false, default: 0 },
      seat_plan: { 
        rightRowsSeatNumbering : desc,
        leftRowsSeatNumbering : desc,
        cabinSeatNumbering : desc,
        backExtraSeatNumbering: desc,
        driverSeat : {type: String},
        leftColumn : {type: String},
        rightColumn : {type: String},
      },
      description: { type: String, required: true},
      pickup: [{
        pickup_time: {type: String},
        pickup_location: {type: String},
      }],
      review: { type: String, default: null },
      punctuality: { type: String, default: null },
      service: { type: String, default: null },
      sanitation: { type: String, default: null },
      comfort: { type: String, default: null },
      bus_number: { type: String, required: true },
    },
    {
      timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'},
      underscore: true,
    },
);

vehicleSchema.virtual('vehicle', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'vehicle_id',
  justOne: true,
});


// tell Mongoose to retrieve the virtual fields
vehicleSchema.set('toObject', {virtuals: true});
vehicleSchema.set('toJSON', {virtuals: true});


module.exports = mongoose.model('Vehicle', vehicleSchema);
