const mongoose = require("mongoose");

const type = {
  title: { type: String, required: true },
  body: { type: String, required: true },
};
const notificationSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    ticket_id: { type: mongoose.Schema.Types.ObjectId, ref: "Ticket" },
    fcm_token: { type: String, required: false },
    unique_id: { type: String, require: false },
    english: type,
    amharic: type,
    oromifa: type,
    isSeen: { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    underscore: true,
  }
);

module.exports = mongoose.model("notification", notificationSchema);
