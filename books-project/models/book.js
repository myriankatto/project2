'use strict';

const mongoose = require('mongoose');

const booksSchema = new mongoose.Schema({
  authors: [
    {
      type: String,
      trim: true
    }
  ],
  title: {
    type: String,
    trim: true
  },
  subtitle: {
    type: String
  },
  year: {
    type: Number
  },
  publisher: {
    type: String
  },
  publishedDate: {
    type: Date
  },
  description: {
    type: String
  },
  pageCount: {
    type: Number
  },
  categories: [
    {
      type: String
    }
  ],
  imageLinks: {
    smallThumbnail: {
      type: String
    },
    thumbnail: {
      type: String
    }
  },
  language: {
    type: String
  }
});

module.exports = mongoose.model('Books', booksSchema);
