const mongoose = require('mongoose');

const supportSchema = new mongoose.Schema(
    {
      title: { type: String, required: true },
      category: { type: mongoose.Schema.Types.ObjectId, ref: 'SupportCategory', required: false },
      description: { type: String, required: true },
      priority: { type: String, required: true, enums: ['low', 'medium', 'high']},
      image: { type: String, required: false },
      status: { type: String, required: true, default: 'open', enums: ['open', 'close', 're-open'] },
      added_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false},
      updated_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false},
    },
    {
      timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'},
      underscore: true,
    },
);

module.exports = mongoose.model('Support', supportSchema);
