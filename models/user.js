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
      trim: true,
      unique: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    picture: {
      type: String,
      default:
        'https://cdn2.vectorstock.com/i/1000x1000/20/76/man-avatar-profile-vector-21372076.jpg'
    },
    about: {
      type: String
    },
    location: {
      type: String
    },
    read: [
      {
        googleID: {
          type: String
        },
        title: {
          type: String
        },
        author: {
          type: Array
        },
        imageUrl: {
          type: String
        }
      }
    ],
    reading: [
      {
        googleID: {
          type: String
        },
        title: {
          type: String
        },
        author: {
          type: Array
        },
        imageUrl: {
          type: String
        }
      }
    ],
    toRead: [
      {
        googleID: {
          type: String
        },
        title: {
          type: String
        },
        author: {
          type: Array
        },
        imageUrl: {
          type: String
        }
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
