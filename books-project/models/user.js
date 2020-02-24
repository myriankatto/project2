'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true
    },
    username: {
      type: String,
      trim: true,
      required: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    picture: {
      type: String
    },
    about: {
      type: String
    },
    location: {
      type: String
    },
    read: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Books'
      }
    ],
    reading: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Books'
      }
    ],
    toRead: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Books'
      }
    ]
  },
  {
    timestamps: {
      createdAt: 'creationDate',
      updatedAt: 'updateDate'
    }
  }
);

module.exports = mongoose.model('User', schema);
