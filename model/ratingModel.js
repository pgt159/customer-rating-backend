const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      trim: true,
      maxLength: [200, 'Description must be less than 200 words'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    rating: {
      type: Number,
      required: [true, 'Please submit rating'],
      min: [0.5, 'Please rate from 0.5 to 5'],
      max: [5, 'Please rate from 0.5 to 5'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A rating must belong to an user'],
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

const Rating = mongoose.model('rating', ratingSchema);
module.exports = Rating;
