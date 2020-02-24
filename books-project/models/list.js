'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book'
    }
  },
  {
    timestamps: {
      createdAt: 'creationDate',
      updatedAt: 'updateDate'
    }
  }
);

module.exports = mongoose.model('List', schema);
