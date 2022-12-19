const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema(
  {
    bus_management: { type: Boolean, required: false, defaulf: false },
    schedule: { type: Boolean, required: false, defaulf: false },
    booking_management: { type: Boolean, required: false, defaulf: false },
    finance_management: { type: Boolean, required: false, defaulf: false },
    user_management: { type: Boolean, required: false, defaulf: false },
    reporting: { type: Boolean, required: false, defaulf: false },
    support: { type: Boolean, required: false, defaulf: false },
    setting: { type: Boolean, required: false, defaulf: false },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    added_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    updated_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    underscore: true,
  },
);

module.exports = mongoose.model('Permission', permissionSchema);
