const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema(
  {
    english: { location: { type: String, required: true } },
    amharic: { location: { type: String, required: false } },
    oromifa: { location: { type: String, required: false } },
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

module.exports = mongoose.model('Location', locationSchema);
