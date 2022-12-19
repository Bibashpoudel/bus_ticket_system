const mongoose = require("mongoose");

const contactUsSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    fullname: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    underscore: true,
  }
);

module.exports = mongoose.model("ContactUs", contactUsSchema);
