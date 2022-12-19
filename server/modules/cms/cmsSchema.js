const mongoose = require("mongoose");

const cmsSchema = new mongoose.Schema(
  {
    english: { type: String, required: true },
    amharic: { type: String, required: true },
    oromifa: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
    added_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    updated_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false},
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    underscore: true,
  }
);

module.exports = mongoose.model("CMS", cmsSchema);
