const mongoose = require('mongoose');

const supportCategorySchema = new mongoose.Schema(
    {
      category: { type: String, required: true },
      added_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false},
      updated_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false},
    },
    {
      timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'},
      underscore: true,
    },
);

module.exports = mongoose.model('SupportCategory', supportCategorySchema);
