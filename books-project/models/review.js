'use strict';

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Books'
    },
    creator: {
      type: mongoose.Schema.Type.ObjectId,
      ref: 'User'
    },
    content: {
      type: String
    },
    rate: {
      type: Number
    },
    timestamps: {
      createdAt: 'creationDate',
      updatedAt: 'updateDate'
    }
  }
);

module.exports = mongoose.model('Review', reviewSchema);
