const mongoose = require('mongoose');

const emailSettingSchema = new mongoose.Schema(
  {
    service: { type: String, required: true },
    host: { type: String, required: true },
    port: { type: String, required: true },
    sender: { type: String, required: true },
    account: { type: String, required: true },
    security: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    added_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    updated_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    underscore: true,
  }
);

module.exports = mongoose.model('EmailSetting', emailSettingSchema);
