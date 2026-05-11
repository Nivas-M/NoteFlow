const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    body: {
      type: String,
      required: [true, 'Body is required'],
      trim: true,
    },
  },
  {
    // Mongoose automatically manages createdAt and updatedAt
    timestamps: true,
  }
);

module.exports = mongoose.model('Note', noteSchema);
