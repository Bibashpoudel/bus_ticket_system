const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fcmTokenSchema = new mongoose.Schema(
  {
    fcm_token: { type: String, required: false },
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: false },
    unique_id: { type: String, required: false },
    enable_notification: { type: Boolean, requied: false, default: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    underscore: true,
  }
);

module.exports = mongoose.model("FcmToken", fcmTokenSchema);
