const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
    {
      support_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Support', required: false},
      comment: { type: String, required: true },
      added_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false},
      updated_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false},
    },
    {
      timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'},
      underscore: true,
    },
);

module.exports = mongoose.model('Comment', commentSchema);
