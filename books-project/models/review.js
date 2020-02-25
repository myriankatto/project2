'use strict';

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    book: {
      type: String
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    content: {
      type: String
    },
    rate: {
      type: Number
    }
  },
  {
    timestamps: {
      createdAt: 'creationDate',
      updatedAt: 'updateDate'
    }
  }
);

module.exports = mongoose.model('Review', reviewSchema);
